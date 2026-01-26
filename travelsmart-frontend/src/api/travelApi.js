/**
 * API Configuration and Wrapper Utility
 * This file centralizes the base URL and provides reusable functions
 * for making authenticated and unauthenticated API calls.
 */

// Configuration for the backend Spring Boot API
// IMPORTANT: This is set to the root of your API version prefix (/api/v1)
export const API_BASE_URL = 'http://localhost:8080/api/v1'; 

// ... (rest of the file content - fetchPublic, fetchAuthenticated, etc.)
/**
 * Helper function to retrieve the authentication token (JWT) from a secure storage mechanism.
 * @returns {string | null} The JWT token or null if not found.
 */
const getAuthToken = () => {
    // NOTE: Replace this with actual secure storage retrieval (e.g., sessionStorage, localStorage, or cookies)
    return localStorage.getItem('jwtToken'); 
};

/**
 * Parses the response body, handling both JSON and plain text for successful requests.
 * @param {Response} response - The fetch Response object.
 * @returns {Promise<any>} The parsed data (JSON object, string, or empty object).
 */
const parseResponse = async (response) => {
    const contentType = response.headers.get("content-type");

    // Handle 204 No Content response
    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {};
    }

    // If JSON is expected, parse it
    if (contentType && contentType.includes("application/json")) {
        return await response.json();
    }
    
    // Otherwise, treat as plain text (e.g., successful registration message)
    return await response.text();
};

/**
 * Fetches data from a public (unauthenticated) endpoint.
 * @param {string} endpoint - The path relative to the base URL (e.g., '/auth/login', '/auth/register').
 * @param {object} options - Standard fetch options (method, body, headers, etc.).
 * @returns {Promise<any>} The response data.
 */
export const fetchPublic = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Default headers for JSON content
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            // Attempt to parse error details (usually JSON from Spring/JWT config)
            const errorData = await parseResponse(response).catch(() => ({ message: response.statusText }));
            
            // Throw an error with the status and message for handling in the component-level wrapper
            const message = typeof errorData === 'object' ? 
                            (errorData.message || errorData.error || response.statusText) : 
                            errorData;
                            
            throw new Error(`API Error: ${response.status} - ${message}`);
        }

        return await parseResponse(response);
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

/**
 * Fetches data from an authenticated endpoint, automatically including the JWT token.
 * @param {string} endpoint - The path relative to the base URL (e.g., '/user/profile', '/flights').
 * @param {object} options - Standard fetch options (method, body, headers, etc.).
 * @returns {Promise<object>} The response data.
 */
export const fetchAuthenticated = async (endpoint, options = {}) => {
    const token = getAuthToken();
    if (!token) {
        // You might redirect the user to the login page here
        throw new Error('Authentication token not found. User must be logged in.');
    }
    
    // Add Authorization header to the request configuration
    const authHeader = {
        'Authorization': `Bearer ${token}`,
    };

    const authOptions = {
        ...options,
        headers: {
            // Merge existing headers, then add authHeader
            ...options.headers, 
            ...authHeader,
        },
    };

    // Use the public fetcher, but with the authentication headers included
    return fetchPublic(endpoint, authOptions);
};

// --- SPECIFIC AUTH ENDPOINT WRAPPERS ---

/**
 * Registers a new user with the given credentials.
 * @param {object} formData - { username, email, password }
 * @returns {object} { success: boolean, message: string }
 */
export async function registerUser(formData) {
    try {
        // Use the generic fetchPublic helper
        const response = await fetchPublic('/auth/register', {
            method: 'POST',
            body: JSON.stringify(formData),
        });

        // The backend returns a plain text confirmation string on success.
        // We ensure we return a standard object for the component.
        return {
            success: true,
            // Use the response text/data as the message
            message: response || "Registration successful! Check your email for an activation link."
        };
    } catch (error) {
        // Catch the error thrown by fetchPublic and clean up the message
        const rawMessage = error.message;
        const cleanMessage = rawMessage.replace(/^API Error: \d+ - /, '');

        return {
            success: false,
            message: cleanMessage || 'Registration failed due to a network or server error.'
        };
    }
}

/**
 * Confirms the user's account using the provided JWT token.
 * @param {string} token - The confirmation token received via email link.
 * @returns {object} { success: boolean, message: string }
 */
export async function confirmAccount(token) {
    if (!token) {
        return { success: false, message: "Missing confirmation token." };
    }
    
    try {
        // The backend requires the token to be sent as a query parameter in the URL.
        const response = await fetchPublic(`/auth/confirm?token=${token}`, {
            method: 'GET', // Or POST, depending on your backend's endpoint design.
                           // Given the backend uses @RequestParam, GET is sufficient here for simplicity.
        });

        // Backend returns a plain text confirmation string on success.
        return {
            success: true,
            message: response || "Your account has been successfully activated. You can now log in!"
        };
    } catch (error) {
        // Catch the error thrown by fetchPublic and clean up the message
        const rawMessage = error.message;
        const cleanMessage = rawMessage.replace(/^API Error: \d+ - /, '');

        return {
            success: false,
            message: cleanMessage || 'Account confirmation failed due to a network or server error.'
        };
    }
}