"use client";

import React from "react";
import { motion } from "motion/react";
import { Search, X } from "lucide-react";

import { Registry } from "@/types";
import { useRegistryState } from "@/hooks/use-registry-state";

import { Field } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

import { RegistryCard } from "./registry-card";
import { SelectionBar } from "./selection-bar";

type RegistriesListProps = {
  registries: Registry[];
};

export const RegistriesList: React.FC<RegistriesListProps> = ({
  registries,
}) => {
  const {
    query,
    setQuery,
    selection,
    setSelection,
    filteredRegistries,
    selectedRegistries,
    handleToggleSelection,
  } = useRegistryState(registries);

  return (
    <div className="mt-6 w-full pb-20">
      <Field className="mb-8">
        <InputGroup className="bg-background dark:bg-background">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search registries..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <InputGroupAddon
            align="inline-end"
            data-disabled={!query.length}
            className="data-[disabled=true]:hidden"
          >
            <InputGroupButton
              aria-label="Clear"
              title="Clear"
              size="icon-xs"
              onClick={() => setQuery(null)}
            >
              <X />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRegistries.map((registry, index) => (
          <motion.div
            key={registry.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <RegistryCard
              registry={registry}
              isSelected={selection.includes(registry.name)}
              onToggle={handleToggleSelection}
            />
          </motion.div>
        ))}
      </div>

      <SelectionBar
        selectedRegistries={selectedRegistries}
        onClear={() => setSelection(null)}
      />
    </div>
  );
};
