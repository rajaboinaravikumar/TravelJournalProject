import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { AuthState, User } from "../types";

type AuthAction =
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
  | { type: "LOGOUT" }
  | { type: "REGISTER_SUCCESS"; payload: { user: User; token: string } }
  | { type: "AUTH_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" }
  | { type: "UPDATE_PROFILE_IMAGE"; payload: string };

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  updateProfileImage: (imageUrl: string) => void;
}

// const serverUrl =
//   import.meta.env.REACT_APP_SERVER_URL ||
//   "https://mini-project-expense-tracker-backend.onrender.com";

const serverUrl = "http://localhost:5000"; // Replace with your server URL

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  error: null,
  token: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    case "AUTH_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    case "UPDATE_PROFILE_IMAGE":
      return {
        ...state,
        user: {
          ...state.user,
          profileImage: action.payload,
        },
      };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token && user) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user: JSON.parse(user),
            token,
          },
        });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${serverUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      console.log("Login response:", data); // Log the response for debugging

      if (!response.ok) {
        dispatch({
          type: "AUTH_ERROR",
          payload: data.message || "Login failed",
        });
        return false;
      }

      // Fetch complete user profile to get profile image
      try {
        const profileResponse = await fetch(`${serverUrl}/api/users/profile`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${data.token}`,
          },
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          console.log("Profile data:", profileData);
          
          // Use the complete profile data
          const completeUser = {
            id: data.user.id || '',
            name: data.user.firstName || '',
            email: data.user.email || '',
            password: '', // Not needed for client-side
            profileImage: profileData.profileImage || profileData.profilePhoto,
          } as User;

      // Store user and token in localStorage
          localStorage.setItem("user", JSON.stringify(completeUser));
      localStorage.setItem("token", data.token);

      // Update state
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: {
              user: completeUser,
              token: data.token,
            },
          });
        } else {
          // Fallback to login data if profile fetch fails
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("token", data.token);

          dispatch({
            type: "LOGIN_SUCCESS",
            payload: {
              user: data.user,
              token: data.token,
            },
          });
        }
      } catch (profileError) {
        console.error("Error fetching profile:", profileError);
        // Fallback to login data
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: data.user,
          token: data.token,
        },
      });
      }

      return true;
    } catch (error) {
      dispatch({
        type: "AUTH_ERROR",
        payload: "Login failed. Please check your connection.",
      });
      return false;
    }
  };

  // Register function
  const register = async (
    firstName: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<boolean> => {
    try {
      const obj = {
        firstName: firstName,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      };
      console.log("Registering user:", obj); // Log the registration data for debugging
      const response = await fetch(`${serverUrl}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      });

      const data = await response.json();

      console.log("Register response:", data); // Log the response for debugging

      if (!response.ok) {
        dispatch({
          type: "AUTH_ERROR",
          payload: data.message || "Registration failed",
        });
        return false;
      }

      // Store user and token in localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      // Update state
      dispatch({
        type: "REGISTER_SUCCESS",
        payload: {
          user: data.user,
          token: data.token,
        },
      });

      return true;
    } catch (error) {
      dispatch({
        type: "AUTH_ERROR",
        payload: "Registration failed. Please check your connection.",
      });
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
  };

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []); // ✅ Doesn't change on re-renders

  // Update profile image
  const updateProfileImage = (imageUrl: string) => {
    if (!imageUrl) return;
    
    // Update state
    dispatch({
      type: "UPDATE_PROFILE_IMAGE",
      payload: imageUrl,
    });
    
    // Update localStorage
    if (state.user) {
      const updatedUser = {
        ...state.user,
        profileImage: imageUrl,
        profilePhoto: imageUrl, // Also update profilePhoto for backend compatibility
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        register,
        logout,
        clearError,
        updateProfileImage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
