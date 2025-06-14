"use client";
import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete';
import { useEffect, useRef, useState } from 'react';
import { MdOutlinePlace } from 'react-icons/md'

type PlacePrediction = {
  place_id: string;
  description: string;
};

type PlacesAutocompleteProps = {
  placeholder: string;
  onPlaceSelected: (placeId: string) => void;
  country?: string;
  disabled?: boolean;
};

export function PlacesAutocomplete({ placeholder, onPlaceSelected, country = 'pe', disabled }: PlacesAutocompleteProps) {
  const [inputValue, setInputValue] = useState('');
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const sessionToken = useRef<google.maps.places.AutocompleteSessionToken>(null);

  useEffect(() => {
    const checkApi = () => {
      if (window.google?.maps?.places?.AutocompleteService) {
        setIsApiLoaded(true);
        autocompleteService.current = new google.maps.places.AutocompleteService();
        sessionToken.current = new google.maps.places.AutocompleteSessionToken();
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
          if (status === 'OK' && results) {
            setPredictions(results.map(p => ({
              place_id: p.place_id,
              description: p.description
            })));
          } else {
            setPredictions([]);
          }
        }
      );
    } catch (error) {
      console.error('Error fetching predictions:', error);
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
      onSelectionChange={(key) => { if (key) onPlaceSelected(key.toString()) }}
      placeholder={placeholder}
      isDisabled={disabled}
      classNames={{
        base: "w-full",
        popoverContent: "bg-white dark:bg-gray-800 shadow-lg rounded-medium",
        listbox: "py-1",
        selectorButton: "text-default-500"
      }}
      listboxProps={{
        className: "bg-white dark:bg-gray-800"
      }}
    >
      {predictions.map((prediction) => (
        <AutocompleteItem 
          key={prediction.place_id} 
          className="hover:bg-gray-100 dark:hover:bg-gray-700" 
          textValue={prediction.description}
        >
          <div className="flex items-center gap-2">
            <span className="flex-shrink-0 text-primary">
              <MdOutlinePlace className='size-3' />
            </span>
            <span className="truncate">{prediction.description}</span>
          </div>
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
}