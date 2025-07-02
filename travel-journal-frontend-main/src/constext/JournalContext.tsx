import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import { Journal, JournalState } from "../types"; // Make sure to define types
import { useAuth } from "./AuthContext";

const serverUrl = "http://localhost:5000";

type JournalAction =
  | { type: "SET_JOURNALS"; payload: Journal[] }
  | { type: "ADD_JOURNAL"; payload: Journal }
  | { type: "JOURNAL_ERROR"; payload: string }
  | { type: "CLEAR_JOURNAL_ERROR" };

interface JournalContextType {
  state: JournalState;
  fetchUserJournals: () => Promise<void>;
  fetchAllJournals: () => Promise<void>;
  createJournal: (formData: FormData) => Promise<boolean>;
  clearError: () => void;
}

const initialState: JournalState = {
  journals: [],
  error: null,
};

const JournalContext = createContext<JournalContextType | undefined>(undefined);

const journalReducer = (
  state: JournalState,
  action: JournalAction
): JournalState => {
  switch (action.type) {
    case "SET_JOURNALS":
      return { ...state, journals: action.payload, error: null };
    case "ADD_JOURNAL":
      return {
        ...state,
        journals: [action.payload, ...state.journals],
        error: null,
      };
    case "JOURNAL_ERROR":
      return { ...state, error: action.payload };
    case "CLEAR_JOURNAL_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
};

export const JournalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(journalReducer, initialState);
  const { state: authState } = useAuth();

  // Fetch user's own journals
  const fetchUserJournals = useCallback(async () => {
    try {
      const res = await fetch(`${serverUrl}/api/journals/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch journals");

      dispatch({ type: "SET_JOURNALS", payload: data });
    } catch (error: any) {
      dispatch({ type: "JOURNAL_ERROR", payload: error.message });
    }
  }, []);

  // Fetch all journals (for explore page)
  const fetchAllJournals = useCallback(async () => {
    try {
      const res = await fetch(`${serverUrl}/api/journals/all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch journals");

      dispatch({ type: "SET_JOURNALS", payload: data });
    } catch (error: any) {
      dispatch({ type: "JOURNAL_ERROR", payload: error.message });
    }
  }, []);

  // Create a new journal
  const createJournal = async (formData: FormData): Promise<boolean> => {
    try {
      const res = await fetch(`${serverUrl}/api/journals`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to create journal");

      dispatch({ type: "ADD_JOURNAL", payload: data });
      return true;
    } catch (error: any) {
      dispatch({ type: "JOURNAL_ERROR", payload: error.message });
      return false;
    }
  };

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_JOURNAL_ERROR" });
  }, []);

  return (
    <JournalContext.Provider
      value={{
        state,
        fetchUserJournals,
        fetchAllJournals,
        createJournal,
        clearError,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
};

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (context === undefined) {
    throw new Error("useJournal must be used within a JournalProvider");
  }
  return context;
};
