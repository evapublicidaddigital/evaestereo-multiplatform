import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useGetTypeSchedulesSimpleQuery } from "../features/schedule/data/services/remote/schedule-api";
import {
  Autocomplete,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import {
  useGetAllCountryQuery,
  useLazyGetAllStateByCountryQuery,
} from "../core/data/services/country-api";
import { useAuthContext } from "../core/context/auth-context/auth-context";

export interface OptionType {
  label: string;
  value: string;
  iso2?: string;
}

export const SelectCountry = (): ReactNode => {
  const { validateLicense } = useAuthContext();
  const { data: typeSchedules = [] } = useGetTypeSchedulesSimpleQuery();
  const { data: countries = [] } = useGetAllCountryQuery();
  const [fetchStates, { data: states = [] }] =
    useLazyGetAllStateByCountryQuery();

  const [typeScheduleSelected, setTypeScheduleSelected] =
    useState<OptionType | null>(null);
  const [countrySelected, setCountrySelected] = useState<OptionType | null>(
    null,
  );
  const [stateSelected, setStateSelected] = useState<OptionType | null>(null);

  const handleSelectTypeContent = useCallback(
    (
      _event: React.SyntheticEvent<Element, Event>,
      newValue: OptionType | null,
    ) => {
      if (newValue) {
        setTypeScheduleSelected(newValue);
      }
    },
    [],
  );

  const handleSelectCountry = useCallback(
    (
      _event: React.SyntheticEvent<Element, Event>,
      newValue: OptionType | null,
    ) => {
      if (newValue) {
        setCountrySelected(newValue);
      }
    },
    [],
  );

  const handleSelectState = useCallback(
    (
      _event: React.SyntheticEvent<Element, Event>,
      newValue: OptionType | null,
    ) => {
      if (newValue) {
        setStateSelected(newValue);
      }
    },
    [],
  );

  const handleSave = useCallback(async (): Promise<void> => {
    try {
      await window.electron.store.delete("typeScheduleId");
      await window.electron.store.delete("countryId");
      await window.electron.store.delete("stateId");

      await window.electron.store.set(
        "typeScheduleId",
        typeScheduleSelected?.value,
      );
      await window.electron.store.set("countryId", countrySelected?.value);
      await window.electron.store.set("stateId", stateSelected?.value);
      await validateLicense();
    } catch (error) {
      console.log("🦋🦋🦋🦋🦋🦋🦋🦋🦋 ========", error);
      alert("Error al guardar los datos");
    }
  }, [typeScheduleSelected, countrySelected, stateSelected, validateLicense]);

  useEffect(() => {
    if (countrySelected?.iso2) {
      fetchStates(countrySelected.iso2);
    }
  }, [countrySelected, fetchStates]);

  const typeScheduleOptions = useMemo(() => {
    return typeSchedules?.map((typeSchedule) => ({
      ...typeSchedule,
      label: typeSchedule.name,
      value: typeSchedule.id,
    }));
  }, [typeSchedules]);

  const countriesOptions = useMemo(() => {
    return countries?.map((country) => ({
      ...country,
      label: country.name,
      value: country.id.toString(),
    }));
  }, [countries]);

  const statesOptions = useMemo(() => {
    return states?.map((state) => ({
      ...state,
      label: state.name,
      value: state.id.toString(),
    }));
  }, [states]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        paddingX: 2,
        paddingTop: 2,
      }}
    >
      <Typography variant="h6">
        Por favor selecciona el tipo de programación, país y estado.
      </Typography>

      <Autocomplete
        disablePortal
        options={typeScheduleOptions}
        sx={{ width: "100%" }}
        onChange={handleSelectTypeContent}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Tipo de programación*"
            margin="dense"
            fullWidth
          />
        )}
      />

      <Autocomplete
        disablePortal
        options={countriesOptions}
        sx={{ width: "100%" }}
        onChange={handleSelectCountry}
        renderInput={(params) => (
          <TextField {...params} label="País*" margin="dense" fullWidth />
        )}
      />

      <Autocomplete
        disablePortal
        options={statesOptions}
        sx={{ width: "100%" }}
        disabled={!countrySelected || states.length === 0}
        onChange={handleSelectState}
        renderInput={(params) => (
          <TextField {...params} label="Estado*" margin="dense" fullWidth />
        )}
      />

      <Button variant="contained" onClick={handleSave}>
        Continuar
      </Button>
    </Box>
  );
};
