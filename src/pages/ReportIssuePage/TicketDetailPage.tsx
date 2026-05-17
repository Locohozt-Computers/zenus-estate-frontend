import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { format, parseISO, differenceInDays } from "date-fns";
import {
  FiArrowLeft,
  FiClock,
  FiFile,
  FiMoreVertical,
  FiPaperclip,
  FiSend,
} from "react-icons/fi";
import { Button, Modal, Typography } from "components/atoms";
import { Loader } from "components/atoms/Loader";
import { DashboardContent } from "layouts";
import { AppIcon } from "utils";
import { ROUTES } from "app-constants";
import {
  closeSupportTicket,
  getSupportTicket,
  getSupportTickets,
  replyToSupportTicket,
  reopenSupportTicket,
} from "pages/request";
import {
  SupportTicketAttachmentI,
  SupportTicketCommentI,
  SupportTicketI,
} from "api";
import { notification } from "services";
import { AttachmentPicker, validateAttachments } from "./AttachmentPicker";
import {
  BackBtn,
  Bubble,
  Chip,
  Composer,
  ComposerRow,
  ConversationList,
  DetailHeader,
  DetailMeta,
  DocItem,
  DocList,
  DuePill,
  ErrorText,
  Gallery,
  GalleryThumb,
  IconBtn,
  InlineImages,
  KebabBtn,
  KebabItem,
  KebabMenu,
  KebabWrap,
  Lightbox,
  PageCard,
  PriorityBadge,
  SectionTitle,
  StatusBadge,
  Timeline,
  TimelineItem,
  Wrapper,
} from "./style";
import { ActivityIcon, IssueTypeIcon } from "./iconMap";

const fmt = (iso?: string | null) => {
  if (!iso) return "";
  try {
    return format(parseISO(iso), "dd MMM yyyy, hh:mm a");
  } catch {
    return iso;
  }
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

const canReopen = (ticket: SupportTicketI): boolean => {
  if (ticket.status !== "resolved" && ticket.status !== "closed") return false;
  if (!ticket.resolved_at) return ticket.status === "closed";
  try {
    return differenceInDays(new Date(), parseISO(ticket.resolved_at)) <= 14;
  } catch {
    return false;
  }
};

const CommentBubble = ({
  comment,
  onImageClick,
}: {
  comment: SupportTicketCommentI;
  onImageClick: (src: string) => void;
}) => {
  const mine = comment.author?.type === "user";
  return (
    <Bubble mine={mine}>
      <span className="author">{comment.author?.name}</span>
      {comment.body && <span className="body">{comment.body}</span>}
      {comment.images.length > 0 && (
        <InlineImages>
          {comment.images.map((img) => (
            <img
              key={img.id}
              src={img.thumbnail_url || img.url}
              alt={img.file_name}
              onClick={() => onImageClick(img.url)}
              role="presentation"
            />
          ))}
        </InlineImages>
      )}
      {comment.documents.length > 0 && (
        <DocList>
          {comment.documents.map((doc) => (
            <DocItem
              key={doc.id}
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: mine ? "white" : undefined }}
            >
              <AppIcon render={FiFile} size={16} />
              <span>{doc.file_name}</span>
              <span style={{ marginLeft: "auto", opacity: 0.7 }}>
                {formatSize(doc.size)}
              </span>
            </DocItem>
          ))}
        </DocList>
      )}
      <span className="meta">{fmt(comment.created_at)}</span>
    </Bubble>
  );
};

const TicketDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [kebabOpen, setKebabOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [replyBody, setReplyBody] = useState("");
  const [replyImages, setReplyImages] = useState<File[]>([]);
  const [replyDocs, setReplyDocs] = useState<File[]>([]);
  const kebabRef = useRef<HTMLDivElement>(null);

  const ticketQuery = useQuery(
    [getSupportTicket.key, id],
    () => getSupportTicket(id as string),
    {
      enabled: !!id,
      refetchInterval: 20_000,
      refetchOnWindowFocus: true,
    }
  );

  const replyMutation = useMutation(
    (data: Parameters<typeof replyToSupportTicket>[1]) =>
      replyToSupportTicket(id as string, data),
    {
      onSuccess: (updated) => {
        queryClient.setQueryData([getSupportTicket.key, id], updated);
        queryClient.invalidateQueries([getSupportTickets.key]);
        setReplyBody("");
        setReplyImages([]);
        setReplyDocs([]);
        notification.success("Reply sent");
      },
    }
  );

  const closeMutation = useMutation(() => closeSupportTicket(id as string), {
    onSuccess: () => {
      notification.success("Ticket closed");
      queryClient.invalidateQueries([getSupportTicket.key, id]);
      queryClient.invalidateQueries([getSupportTickets.key]);
      setKebabOpen(false);
    },
  });

  const reopenMutation = useMutation(() => reopenSupportTicket(id as string), {
    onSuccess: () => {
      notification.success("Ticket reopened");
      queryClient.invalidateQueries([getSupportTicket.key, id]);
      queryClient.invalidateQueries([getSupportTickets.key]);
      setKebabOpen(false);
    },
  });

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (kebabRef.current && !kebabRef.current.contains(e.target as Node)) {
        setKebabOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const ticket = ticketQuery.data;
  const attachmentChecks = useMemo(
    () => validateAttachments(replyImages, replyDocs),
    [replyImages, replyDocs]
  );
  const hasAttachmentErrors =
    attachmentChecks.imageErrors.some(Boolean) ||
    attachmentChecks.attachmentErrors.some(Boolean) ||
    !!attachmentChecks.globalError;

  const replyEmpty =
    !replyBody.trim() && replyImages.length === 0 && replyDocs.length === 0;

  const submitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyEmpty || hasAttachmentErrors) return;
    replyMutation.mutate({
      body: replyBody.trim() || undefined,
      images: replyImages,
      attachments: replyDocs,
    });
  };

  const reversedActivities = useMemo(
    () => ticket?.activities ?? [],
    [ticket?.activities]
  );

  const openable = ticket && ticket.status !== "closed";
  const reopenable = ticket && canReopen(ticket);

  return (
    <DashboardContent>
      <Wrapper>
        <PageCard>
          <BackBtn
            type="button"
            onClick={() => navigate(ROUTES.reportIssue.fullPath)}
          >
            <FiArrowLeft size={14} /> Back to tickets
          </BackBtn>

          <Loader absolute open={ticketQuery.isLoading} />

          {ticket && (
            <>
              <DetailHeader>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                    }}
                  >
                    <IssueTypeIcon
                      icon={ticket.issue_type?.icon}
                      color={ticket.issue_type?.color || undefined}
                      size={28}
                    />
                    <div>
                      <Typography variant="heading5" weight={600}>
                        {ticket.subject}
                      </Typography>
                      <Typography size={12} textColor="gray">
                        {ticket.ticket_number} · {ticket.issue_type?.name}
                      </Typography>
                    </div>
                  </div>

                  <KebabWrap ref={kebabRef}>
                    <KebabBtn
                      type="button"
                      aria-label="Ticket actions"
                      onClick={() => setKebabOpen((v) => !v)}
                    >
                      <AppIcon render={FiMoreVertical} size={18} />
                    </KebabBtn>
                    {kebabOpen && (
                      <KebabMenu>
                        {openable && (
                          <KebabItem
                            type="button"
                            onClick={() => closeMutation.mutate()}
                            disabled={closeMutation.isLoading}
                          >
                            Close ticket
                          </KebabItem>
                        )}
                        {reopenable && (
                          <KebabItem
                            type="button"
                            onClick={() => reopenMutation.mutate()}
                            disabled={reopenMutation.isLoading}
                          >
                            Reopen ticket
                          </KebabItem>
                        )}
                        {!openable && !reopenable && (
                          <KebabItem
                            as="div"
                            style={{ cursor: "default", opacity: 0.7 }}
                          >
                            No actions available
                          </KebabItem>
                        )}
                      </KebabMenu>
                    )}
                  </KebabWrap>
                </div>

                <DetailMeta>
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority}>
                    {ticket.priority}
                  </PriorityBadge>
                  {ticket.due_date && (
                    <DuePill overdue={ticket.is_overdue}>
                      <FiClock size={11} />
                      {ticket.is_overdue ? "Overdue " : "Due "}{" "}
                      {fmt(ticket.due_date)}
                    </DuePill>
                  )}
                  {ticket.property && (
                    <Chip>House {ticket.property.house_no}</Chip>
                  )}
                  {ticket.assigned_to?.map((a) => (
                    <Chip key={`${a.type}-${a.id}-${a.role}`}>
                      Assigned: {a.name}
                    </Chip>
                  ))}
                </DetailMeta>

                <Typography
                  size={14}
                  style={{
                    color: "var(--dark-gray)",
                    whiteSpace: "pre-wrap",
                    marginTop: 8,
                  }}
                >
                  {ticket.description}
                </Typography>
              </DetailHeader>

              {ticket.images.length > 0 && (
                <>
                  <SectionTitle>Photos</SectionTitle>
                  <Gallery>
                    {ticket.images.map((img: SupportTicketAttachmentI) => (
                      <GalleryThumb
                        key={img.id}
                        type="button"
                        src={img.thumbnail_url || img.url}
                        aria-label={`Open ${img.file_name}`}
                        onClick={() => setLightboxSrc(img.url)}
                      />
                    ))}
                  </Gallery>
                </>
              )}

              {ticket.documents.length > 0 && (
                <>
                  <SectionTitle>Documents</SectionTitle>
                  <DocList>
                    {ticket.documents.map((doc) => (
                      <DocItem
                        key={doc.id}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <AppIcon render={FiFile} size={16} />
                        <span>{doc.file_name}</span>
                        <span
                          style={{
                            marginLeft: "auto",
                            color: "var(--med-gray)",
                          }}
                        >
                          {formatSize(doc.size)}
                        </span>
                      </DocItem>
                    ))}
                  </DocList>
                </>
              )}

              <SectionTitle>Conversation</SectionTitle>
              <ConversationList>
                {ticket.comments.length === 0 && (
                  <Typography size={13} textColor="gray">
                    No replies yet. Your message will appear here.
                  </Typography>
                )}
                {ticket.comments.map((c) => (
                  <CommentBubble
                    key={c.id}
                    comment={c}
                    onImageClick={(src) => setLightboxSrc(src)}
                  />
                ))}
              </ConversationList>

              <button
                type="button"
                onClick={() => setShowHistory((v) => !v)}
                style={{
                  marginTop: 24,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--blue)",
                  fontSize: 13,
                  fontWeight: 600,
                  padding: 0,
                }}
              >
                {showHistory ? "Hide history" : "Show history"}
              </button>

              {showHistory && (
                <>
                  <SectionTitle>History</SectionTitle>
                  <Timeline>
                    {reversedActivities.map((a, idx) => (
                      <TimelineItem key={a.id ?? `${a.created_at}-${idx}`}>
                        <span className="icon">
                          <ActivityIcon type={a.type} />
                        </span>
                        <div>
                          <div>{a.description}</div>
                          <div className="meta">{fmt(a.created_at)}</div>
                        </div>
                      </TimelineItem>
                    ))}
                  </Timeline>
                </>
              )}

              {ticket.status !== "closed" && (
                <Composer onSubmit={submitReply}>
                  <ComposerRow>
                    <textarea
                      placeholder="Write a reply…"
                      value={replyBody}
                      onChange={(e) => setReplyBody(e.target.value)}
                      rows={2}
                    />
                    <IconBtn aria-label="Attach photo">
                      <AppIcon render={FiPaperclip} size={18} />
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          if (!e.target.files) return;
                          setReplyImages((prev) => [
                            ...prev,
                            ...Array.from(e.target.files as FileList),
                          ]);
                          e.target.value = "";
                        }}
                      />
                    </IconBtn>
                    <Button
                      type="submit"
                      loading={replyMutation.isLoading}
                      disabled={
                        replyEmpty ||
                        hasAttachmentErrors ||
                        replyMutation.isLoading
                      }
                      style={{ width: 90 }}
                    >
                      <AppIcon render={FiSend} size={14} />
                      <span style={{ marginLeft: 6 }}>Send</span>
                    </Button>
                  </ComposerRow>
                  {(replyImages.length > 0 || replyDocs.length > 0) && (
                    <AttachmentPicker
                      images={replyImages}
                      attachments={replyDocs}
                      onImagesChange={setReplyImages}
                      onAttachmentsChange={setReplyDocs}
                      imageErrors={attachmentChecks.imageErrors}
                      attachmentErrors={attachmentChecks.attachmentErrors}
                      globalError={attachmentChecks.globalError}
                      compact
                    />
                  )}
                  {replyEmpty && (
                    <ErrorText style={{ visibility: "hidden" }}>
                      placeholder
                    </ErrorText>
                  )}
                </Composer>
              )}
            </>
          )}

          <Modal
            visible={!!lightboxSrc}
            maxWidth={900}
            closeModal={() => setLightboxSrc(null)}
          >
            {lightboxSrc && (
              <Lightbox>
                <img src={lightboxSrc} alt="Attachment" />
              </Lightbox>
            )}
          </Modal>
        </PageCard>
      </Wrapper>
    </DashboardContent>
  );
};

export default TicketDetailPage;
