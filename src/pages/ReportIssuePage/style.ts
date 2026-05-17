import styled, { css } from "styled-components/macro";
import { pxToEm } from "utils";
import { Card } from "components";
import { SupportTicketPriority, SupportTicketStatus } from "api";

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: calc(100vh - 40px);
  padding: 16px 0;
`;

export const PageCard = styled(Card)`
  padding: 24px;
  max-width: 980px;
  width: 100%;

  @media screen and (min-width: ${pxToEm(900, false)}) {
    padding: 40px 56px;
  }
`;

export const TabBar = styled.div`
  display: flex;
  gap: 4px;
  border-bottom: 1px solid var(--med-gray);
  margin-bottom: 28px;
`;

export const TabBtn = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  padding: 12px 20px;
  font-size: 15px;
  font-weight: ${({ active }) => (active ? 600 : 400)};
  color: ${({ active }) => (active ? "var(--blue)" : "var(--med-gray)")};
  cursor: pointer;
  border-bottom: 3px solid
    ${({ active }) => (active ? "var(--blue)" : "transparent")};
  margin-bottom: -1px;
  transition: color 0.15s;
`;

export const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  margin-top: 20px;
  gap: 16px;

  @media screen and (min-width: ${pxToEm(700)}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (min-width: ${pxToEm(1000)}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const CategoryBtn = styled.button<{ active?: boolean; accent?: string }>`
  background-color: white;
  cursor: pointer;
  width: 100%;
  padding: 16px;
  border-radius: 10px;
  border: ${({ active, accent }) =>
    active
      ? `2px solid ${accent || "var(--blue)"}`
      : "1px solid var(--med-gray)"};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 8px;
  min-height: 88px;
  transition: transform 0.15s, box-shadow 0.15s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  }
`;

export const FormBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const FieldLabel = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: var(--med-gray);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

export const TextInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid var(--med-gray);
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  background: white;

  &:focus {
    border-color: var(--blue);
  }
`;

export const PrioritySelect = styled.select`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid var(--med-gray);
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: var(--blue);
  }
`;

export const ErrorText = styled.small`
  display: block;
  color: var(--pink);
  font-size: 12px;
  margin-top: 4px;
`;

export const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin: 16px 0 20px;
`;

export const FilterPills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 4px;
  background: #f5f7fb;
  border-radius: 999px;
`;

export const FilterPill = styled.button<{ active?: boolean }>`
  border: none;
  cursor: pointer;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: ${({ active }) => (active ? 600 : 500)};
  color: ${({ active }) => (active ? "white" : "var(--med-gray)")};
  background: ${({ active }) => (active ? "var(--blue)" : "transparent")};
  transition: all 0.15s;
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  box-sizing: border-box;
  border: 1px solid var(--med-gray);
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 13px;
  outline: none;
  background: white;

  &:focus {
    border-color: var(--blue);
  }
`;

export const TicketRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--light-gray);
  border-radius: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  background: white;
  transition: box-shadow 0.15s, transform 0.15s;

  &:hover {
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
    transform: translateY(-1px);
  }

  @media screen and (min-width: ${pxToEm(640)}) {
    grid-template-columns: 72px 1fr auto;
    align-items: center;
  }
`;

export const Thumb = styled.div<{ src?: string | null }>`
  width: 72px;
  height: 72px;
  border-radius: 8px;
  background: var(--light-gray)
    ${({ src }) => (src ? `url("${src}") center/cover no-repeat` : "")};
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--med-gray);
  font-size: 11px;
  flex-shrink: 0;
`;

export const RowMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
`;

export const RowRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  font-size: 12px;
  color: var(--med-gray);
`;

export const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #eef2f7;
  color: var(--med-gray);
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 999px;
`;

const statusColors: Record<
  SupportTicketStatus,
  { bg: string; fg: string; label: string }
> = {
  open: { bg: "#fff4e0", fg: "#b76d00", label: "Open" },
  replied: { bg: "#e3efff", fg: "#0d57c1", label: "Replied" },
  on_hold: { bg: "#ececec", fg: "#5a5a5a", label: "On Hold" },
  resolved: { bg: "#e7f6ec", fg: "#0a7d27", label: "Resolved" },
  closed: { bg: "#e3e6ec", fg: "#3b4456", label: "Closed" },
};

export const StatusBadge = styled.span<{ status: SupportTicketStatus }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: ${({ status }) => statusColors[status].bg};
  color: ${({ status }) => statusColors[status].fg};
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  padding: 3px 10px;
  border-radius: 999px;

  &::before {
    content: "${({ status }) => statusColors[status].label}";
  }
`;

const priorityColors: Record<
  SupportTicketPriority,
  { bg: string; fg: string }
> = {
  low: { bg: "#e7f6ec", fg: "#0a7d27" },
  medium: { bg: "#fff4e0", fg: "#b76d00" },
  high: { bg: "#fde7e9", fg: "#c1283a" },
};

export const PriorityBadge = styled.span<{ priority: SupportTicketPriority }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: ${({ priority }) => priorityColors[priority].bg};
  color: ${({ priority }) => priorityColors[priority].fg};
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  padding: 3px 10px;
  border-radius: 999px;
`;

export const DuePill = styled.span<{ overdue?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
  background: ${({ overdue }) => (overdue ? "#fde7e9" : "#eef2f7")};
  color: ${({ overdue }) => (overdue ? "var(--pink)" : "var(--med-gray)")};
`;

export const CommentsBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #eaf2ff;
  color: var(--blue);
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 999px;
`;

export const EmptyState = styled.div`
  padding: 60px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

export const PaginationBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  margin-top: 24px;
  font-size: 13px;
  color: var(--med-gray);
`;

export const PaginationBtn = styled.button`
  background: none;
  border: 1px solid var(--med-gray);
  border-radius: 8px;
  padding: 6px 14px;
  cursor: pointer;
  font-size: 13px;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

// -------- Attachment picker --------
export const AttachRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

export const AttachThumb = styled.div<{ src?: string }>`
  position: relative;
  width: 78px;
  height: 78px;
  border-radius: 8px;
  background: var(--light-gray)
    ${({ src }) => (src ? `url("${src}") center/cover no-repeat` : "")};
  border: 1px solid var(--light-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--med-gray);
  font-size: 10px;
  padding: 6px;
  text-align: center;
  word-break: break-all;
  overflow: hidden;
`;

export const RemoveAttachBtn = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--pink);
  color: white;
  border: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  line-height: 1;
  padding: 0;
`;

export const AddAttachBtn = styled.label`
  width: 78px;
  height: 78px;
  border-radius: 8px;
  border: 1px dashed var(--med-gray);
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--med-gray);
  font-size: 11px;

  input {
    display: none;
  }

  &:hover {
    border-color: var(--blue);
    color: var(--blue);
  }
`;

// -------- Detail page --------
export const DetailHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

export const DetailMeta = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

export const BackBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--med-gray);
  font-size: 13px;
  padding: 0;
  margin-bottom: 14px;

  &:hover {
    color: var(--blue);
  }
`;

export const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: var(--dark-gray);
  margin: 24px 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

export const Gallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 8px;
`;

export const GalleryThumb = styled.button<{ src: string }>`
  background: var(--light-gray) url("${({ src }) => src}") center/cover
    no-repeat;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: transform 0.15s;

  &:hover {
    transform: scale(1.02);
  }
`;

export const DocList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const DocItem = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--dark-gray);
  padding: 10px 12px;
  border: 1px solid var(--light-gray);
  border-radius: 8px;
  font-size: 13px;
  background: white;

  &:hover {
    border-color: var(--blue);
    color: var(--blue);
  }
`;

export const ConversationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const bubbleBase = css`
  padding: 12px 14px;
  border-radius: 12px;
  max-width: 85%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Bubble = styled.div<{ mine?: boolean }>`
  ${bubbleBase}
  align-self: ${({ mine }) => (mine ? "flex-end" : "flex-start")};
  background: ${({ mine }) => (mine ? "var(--blue)" : "#f1f4f9")};
  color: ${({ mine }) => (mine ? "white" : "var(--dark-gray)")};

  .author {
    font-size: 11px;
    font-weight: 600;
    opacity: 0.8;
  }

  .body {
    font-size: 14px;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .meta {
    font-size: 11px;
    opacity: 0.75;
  }
`;

export const InlineImages = styled.div`
  display: flex;
  gap: 6px;
  overflow-x: auto;

  img {
    width: 90px;
    height: 90px;
    object-fit: cover;
    border-radius: 6px;
    cursor: pointer;
    flex-shrink: 0;
  }
`;

export const Composer = styled.form`
  position: sticky;
  bottom: 0;
  margin-top: 20px;
  background: white;
  border-top: 1px solid var(--light-gray);
  padding: 12px 0 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ComposerRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;

  textarea {
    flex: 1;
    border: 1px solid var(--med-gray);
    border-radius: 10px;
    padding: 10px 12px;
    font-family: inherit;
    font-size: 14px;
    resize: vertical;
    min-height: 60px;
    outline: none;

    &:focus {
      border-color: var(--blue);
    }
  }
`;

export const IconBtn = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--light-gray);
  color: var(--med-gray);
  cursor: pointer;

  input {
    display: none;
  }

  &:hover {
    color: var(--blue);
  }
`;

export const Timeline = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const TimelineItem = styled.li`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  font-size: 13px;
  color: var(--dark-gray);

  .icon {
    color: var(--med-gray);
    margin-top: 2px;
    flex-shrink: 0;
  }

  .meta {
    color: var(--med-gray);
    font-size: 11px;
  }
`;

export const KebabWrap = styled.div`
  position: relative;
`;

export const KebabBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 8px;
  color: var(--med-gray);

  &:hover {
    background: var(--light-gray);
  }
`;

export const KebabMenu = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 4px;
  background: white;
  border: 1px solid var(--light-gray);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  padding: 6px;
  z-index: 5;
  min-width: 160px;
  display: flex;
  flex-direction: column;
`;

export const KebabItem = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 13px;
  color: var(--dark-gray);

  &:hover {
    background: var(--light-gray);
  }
`;

export const Lightbox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%;
    max-height: 80vh;
    border-radius: 10px;
  }
`;
