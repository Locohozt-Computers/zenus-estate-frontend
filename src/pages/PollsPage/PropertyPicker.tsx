import React from "react";
import { PropertyI } from "api";
import { FieldLabel, PropertySelect } from "./style";

interface Props {
  properties: PropertyI[];
  value: number | undefined;
  onChange: (id: number) => void;
  disabled?: boolean;
}

export const PropertyPicker = ({
  properties,
  value,
  onChange,
  disabled,
}: Props) => {
  return (
    <div>
      <FieldLabel>Vote on behalf of property</FieldLabel>
      <PropertySelect
        disabled={disabled}
        value={value ?? ""}
        onChange={(e) => {
          const next = Number(e.target.value);
          if (!Number.isNaN(next)) onChange(next);
        }}
      >
        <option value="" disabled>
          Select a property
        </option>
        {properties.map((p) => (
          <option key={p.id} value={p.id}>
            House {p.house_no} {p.is_primary ? "(Primary)" : ""}
          </option>
        ))}
      </PropertySelect>
    </div>
  );
};
