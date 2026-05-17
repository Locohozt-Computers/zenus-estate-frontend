import React, { useMemo } from "react";
import { FiFile, FiImage, FiPlus } from "react-icons/fi";
import { AppIcon } from "utils";
import {
  AddAttachBtn,
  AttachRow,
  AttachThumb,
  ErrorText,
  RemoveAttachBtn,
} from "./style";

export const MAX_IMAGES = 5;
export const MAX_DOCS = 5;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_DOC_BYTES = 10 * 1024 * 1024;
export const IMAGE_MIMES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/heic",
  "image/webp",
];
export const DOC_MIMES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const isImage = (f: File) =>
  IMAGE_MIMES.includes(f.type) || /\.(jpe?g|png|heic|webp)$/i.test(f.name);

const isDoc = (f: File) =>
  DOC_MIMES.includes(f.type) || /\.(pdf|docx?|)$/i.test(f.name);

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

type Props = {
  images: File[];
  attachments: File[];
  onImagesChange: (files: File[]) => void;
  onAttachmentsChange: (files: File[]) => void;
  imageErrors?: (string | undefined)[];
  attachmentErrors?: (string | undefined)[];
  globalError?: string;
  compact?: boolean;
};

export const AttachmentPicker = ({
  images,
  attachments,
  onImagesChange,
  onAttachmentsChange,
  imageErrors,
  attachmentErrors,
  globalError,
  compact,
}: Props) => {
  const imagePreviews = useMemo(
    () => images.map((f) => URL.createObjectURL(f)),
    [images]
  );

  React.useEffect(() => {
    return () => {
      imagePreviews.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [imagePreviews]);

  const addImages = (incoming: FileList | null) => {
    if (!incoming) return;
    const next = [...images];
    Array.from(incoming).forEach((f) => {
      if (next.length >= MAX_IMAGES) return;
      if (!isImage(f)) return;
      next.push(f);
    });
    onImagesChange(next);
  };

  const addDocs = (incoming: FileList | null) => {
    if (!incoming) return;
    const next = [...attachments];
    Array.from(incoming).forEach((f) => {
      if (next.length >= MAX_DOCS) return;
      if (!isDoc(f)) return;
      next.push(f);
    });
    onAttachmentsChange(next);
  };

  const removeImage = (idx: number) => {
    onImagesChange(images.filter((_, i) => i !== idx));
  };
  const removeDoc = (idx: number) => {
    onAttachmentsChange(attachments.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <AttachRow>
        {imagePreviews.map((src, idx) => (
          <AttachThumb key={src} src={src}>
            <RemoveAttachBtn
              type="button"
              aria-label="Remove photo"
              onClick={() => removeImage(idx)}
            >
              ×
            </RemoveAttachBtn>
            {imageErrors?.[idx] && (
              <ErrorText style={{ position: "absolute", bottom: -18 }}>
                {imageErrors[idx]}
              </ErrorText>
            )}
          </AttachThumb>
        ))}
        {images.length < MAX_IMAGES && (
          <AddAttachBtn>
            <AppIcon render={FiImage} size={20} />
            <span>{compact ? "Photo" : "Add photo"}</span>
            <input
              type="file"
              accept={IMAGE_MIMES.join(",")}
              multiple
              onChange={(e) => {
                addImages(e.target.files);
                e.target.value = "";
              }}
            />
          </AddAttachBtn>
        )}

        {attachments.map((f, idx) => (
          <AttachThumb key={`${f.name}-${f.size}-${f.lastModified}`}>
            <AppIcon render={FiFile} size={22} />
            <div>
              <div style={{ fontWeight: 600 }}>{f.name}</div>
              <div>{formatSize(f.size)}</div>
            </div>
            <RemoveAttachBtn
              type="button"
              aria-label="Remove file"
              onClick={() => removeDoc(idx)}
            >
              ×
            </RemoveAttachBtn>
            {attachmentErrors?.[idx] && (
              <ErrorText style={{ position: "absolute", bottom: -18 }}>
                {attachmentErrors[idx]}
              </ErrorText>
            )}
          </AttachThumb>
        ))}
        {attachments.length < MAX_DOCS && (
          <AddAttachBtn>
            <AppIcon render={FiPlus} size={20} />
            <span>{compact ? "Doc" : "Add document"}</span>
            <input
              type="file"
              accept={DOC_MIMES.join(",")}
              multiple
              onChange={(e) => {
                addDocs(e.target.files);
                e.target.value = "";
              }}
            />
          </AddAttachBtn>
        )}
      </AttachRow>
      {globalError && <ErrorText>{globalError}</ErrorText>}
    </div>
  );
};

export const validateAttachments = (
  images: File[],
  attachments: File[]
): {
  imageErrors: (string | undefined)[];
  attachmentErrors: (string | undefined)[];
  globalError?: string;
} => {
  const imageErrors = images.map((f) => {
    if (
      !IMAGE_MIMES.includes(f.type) &&
      !/\.(jpe?g|png|heic|webp)$/i.test(f.name)
    )
      return "Unsupported image format.";
    if (f.size > MAX_IMAGE_BYTES) return "Photo must be 5MB or smaller.";
    return undefined;
  });
  const attachmentErrors = attachments.map((f) => {
    if (!DOC_MIMES.includes(f.type) && !/\.(pdf|docx?)$/i.test(f.name))
      return "Only PDF, DOC, DOCX allowed.";
    if (f.size > MAX_DOC_BYTES) return "Document must be 10MB or smaller.";
    return undefined;
  });
  let globalError: string | undefined;
  if (images.length > MAX_IMAGES) globalError = "Max 5 photos.";
  if (attachments.length > MAX_DOCS)
    globalError = `${globalError ? `${globalError} ` : ""}Max 5 documents.`;
  return { imageErrors, attachmentErrors, globalError };
};
