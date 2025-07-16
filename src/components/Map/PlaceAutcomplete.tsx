"use client";

import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { useEffect, useRef, useState } from "react";
import { MdOutlinePlace } from "react-icons/md";
import styles from "./PlacesAutocomplete.module.css";

type PlacePrediction = {
  place_id: string;
  description: string;
};

type PlacesAutocompleteProps = {
  placeholder: string;
  onPlaceSelected: (placeId: string) => void;
  country?: string;
  disabled?: boolean;
  initialValue?: string;
};

export function PlacesAutocomplete({
  placeholder,
  onPlaceSelected,
  country = "pe",
  disabled,
  initialValue = "",
}: PlacesAutocompleteProps) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const autocompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const sessionToken =
    useRef<google.maps.places.AutocompleteSessionToken>(null);

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const checkApi = () => {
      if (window.google?.maps?.places?.AutocompleteService) {
        setIsApiLoaded(true);
        autocompleteService.current =
          new google.maps.places.AutocompleteService();
        sessionToken.current =
          new google.maps.places.AutocompleteSessionToken();
      } else {
        setTimeout(checkApi, 100);
      }
    };
    checkApi();
  }, []);

  const fetchPredictions = async (input: string) => {
    if (!isApiLoaded || !autocompleteService.current || input.length < 3) {
      setPredictions([]);
      return;
    }

    try {
      const request: google.maps.places.AutocompletionRequest = {
        input,
        sessionToken: sessionToken?.current || undefined,
        componentRestrictions: { country },
      };

      autocompleteService?.current?.getPlacePredictions(
        request,
        (results, status) => {
          if (status === "OK" && results) {
            setPredictions(
              results.map((p) => ({
                place_id: p.place_id,
                description: p.description,
              }))
            );
          } else {
            setPredictions([]);
          }
        }
      );
    } catch (error) {
      console.error("Error fetching predictions:", error);
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    fetchPredictions(value);
  };

  return (
    <Autocomplete
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onSelectionChange={(key) => {
        if (key) onPlaceSelected(key.toString());
      }}
      placeholder={placeholder}
      isDisabled={disabled}
      classNames={{
        base: styles.base,
        popoverContent: styles.popoverContent,
        listbox: styles.listbox,
        selectorButton: styles.selectorButton,
      }}
      listboxProps={{
        className: styles.listboxContent,
      }}
    >
      {predictions.map((prediction) => (
        <AutocompleteItem
          key={prediction.place_id}
          className={styles.item}
          textValue={prediction.description}
        >
          <div className={styles.itemContent}>
            <span className={styles.iconWrapper}>
              <MdOutlinePlace className={styles.icon} />
            </span>
            <span className={styles.description}>{prediction.description}</span>
          </div>
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
}
