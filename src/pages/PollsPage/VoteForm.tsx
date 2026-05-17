import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Button } from "components/atoms";
import { PollI, PollOptionI } from "api";
import { getPoll, getPolls, getProperties, votePoll } from "pages/request";
import { PropertyPicker } from "./PropertyPicker";
import { VoteSuccessModal } from "./VoteSuccessModal";
import {
  Counter,
  ErrorText,
  FieldLabel,
  FormFooter,
  InfoBanner,
  OptionList,
  OptionRow,
} from "./style";

interface Props {
  poll: PollI;
}

interface SuccessState {
  alreadyVoted: boolean;
  options: PollOptionI[];
}

export const VoteForm = ({ poll }: Props) => {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<number[]>([]);
  const [customerId, setCustomerId] = useState<number | undefined>();
  const [touched, setTouched] = useState(false);
  const [success, setSuccess] = useState<SuccessState | null>(null);

  const isPropertyScope = poll.voting_scope === "property";
  const propertiesQuery = useQuery([getProperties.key], () => getProperties(), {
    enabled: isPropertyScope,
  });
  const activeProperties = useMemo(
    () => propertiesQuery.data ?? [],
    [propertiesQuery.data]
  );

  useEffect(() => {
    if (
      isPropertyScope &&
      activeProperties.length === 1 &&
      customerId === undefined
    ) {
      setCustomerId(activeProperties[0].id);
    }
  }, [isPropertyScope, activeProperties, customerId]);

  const maxSelections =
    poll.selection_type === "single" ? 1 : Math.max(1, poll.max_selections);

  const toggleOption = (id: number) => {
    if (poll.selection_type === "single") {
      setSelected([id]);
      return;
    }
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= maxSelections) return prev;
      return [...prev, id];
    });
  };

  const mutation = useMutation(
    ({
      id,
      body,
    }: {
      id: number;
      body: { option_ids: number[]; customer_id?: number };
    }) => votePoll(id, body),
    {
      onSuccess: (envelope) => {
        setSuccess({
          alreadyVoted: envelope.data.already_voted,
          options: envelope.data.options,
        });
        queryClient.invalidateQueries([getPoll.key, String(poll.id)]);
        queryClient.invalidateQueries([getPolls.key]);
      },
      onError: (error: AxiosError<{ message?: string }>) => {
        const status = error.response?.status;
        const msg = error.response?.data?.message ?? "";
        if (status === 422 && /not currently open/i.test(msg)) {
          queryClient.invalidateQueries([getPoll.key, String(poll.id)]);
        }
      },
    }
  );

  if (isPropertyScope && propertiesQuery.isLoading) {
    return <InfoBanner tone="info">Loading your properties…</InfoBanner>;
  }

  if (
    isPropertyScope &&
    !propertiesQuery.isLoading &&
    activeProperties.length === 0
  ) {
    return (
      <InfoBanner tone="warn">
        You must be assigned to a property to vote on this poll.
      </InfoBanner>
    );
  }

  const errors: string[] = [];
  if (selected.length === 0) errors.push("Select an option.");
  if (selected.length > maxSelections)
    errors.push(`You can select at most ${maxSelections} option(s).`);
  if (isPropertyScope && !customerId) errors.push("Select a property.");

  const submitDisabled = errors.length > 0 || mutation.isLoading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (submitDisabled) return;
    mutation.mutate({
      id: poll.id,
      body: {
        option_ids: selected,
        ...(isPropertyScope && customerId ? { customer_id: customerId } : {}),
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {isPropertyScope && activeProperties.length > 1 && (
        <PropertyPicker
          properties={activeProperties}
          value={customerId}
          onChange={setCustomerId}
        />
      )}

      <FieldLabel>
        {poll.selection_type === "single"
          ? "Pick one option"
          : `Pick up to ${maxSelections} option(s)`}
      </FieldLabel>

      <OptionList>
        {poll.options.map((opt) => {
          const isSelected = selected.includes(opt.id);
          const reachedMax =
            !isSelected &&
            poll.selection_type === "multi" &&
            selected.length >= maxSelections;
          return (
            <OptionRow key={opt.id} selected={isSelected} disabled={reachedMax}>
              <input
                type={poll.selection_type === "single" ? "radio" : "checkbox"}
                name="poll-option"
                checked={isSelected}
                disabled={reachedMax}
                onChange={() => toggleOption(opt.id)}
              />
              <div>
                <div className="label">{opt.label}</div>
                {opt.description && (
                  <div className="desc">{opt.description}</div>
                )}
              </div>
            </OptionRow>
          );
        })}
      </OptionList>

      {touched && errors.map((err) => <ErrorText key={err}>{err}</ErrorText>)}

      <FormFooter>
        {poll.selection_type === "multi" && (
          <Counter>
            {selected.length}/{maxSelections} selected
          </Counter>
        )}
        <Button
          type="submit"
          text={mutation.isLoading ? "Submitting…" : "Submit vote"}
          loading={mutation.isLoading}
          disabled={submitDisabled}
          onClick={handleSubmit}
        />
      </FormFooter>

      {success && (
        <VoteSuccessModal
          visible
          alreadyVoted={success.alreadyVoted}
          options={success.options}
          onClose={() => setSuccess(null)}
        />
      )}
    </form>
  );
};
