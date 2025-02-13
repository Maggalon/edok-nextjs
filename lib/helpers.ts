import { CollectionItem } from "./types";

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    // Earth's radius in kilometers
    const R = 6371;

    // Convert latitude and longitude from degrees to radians
    const lat1Rad = toRadians(lat1);
    const lon1Rad = toRadians(lon1);
    const lat2Rad = toRadians(lat2);
    const lon2Rad = toRadians(lon2);

    // Differences in coordinates
    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;

    // Haversine formula
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    // Calculate distance
    const distance = R * c;
    
    return distance;
}

// Helper function to convert degrees to radians
function toRadians(degrees: number) {
    return degrees * (Math.PI / 180);
}

interface ValidationResult {
    isValid: boolean;
    errors: {
        email?: string[];
        password?: string[];
    };
}

interface ValidationRules {
    email: {
        required?: boolean;
        maxLength?: number;
        pattern?: RegExp;
    };
    password: {
        required?: boolean;
        minLength?: number;
        maxLength?: number;
        requireCapital?: boolean;
        requireNumber?: boolean;
        requireSpecialChar?: boolean;
    };
}

export const validateForm = (data: { email: string; password: string }, rules: ValidationRules = defaultRules): ValidationResult => {
    const errors: ValidationResult['errors'] = {};

    // Email validation
    const emailErrors: string[] = [];
    if (rules.email.required && !data.email) {
        emailErrors.push('Email is required');
    } else if (data.email) {
        if (rules.email.maxLength && data.email.length > rules.email.maxLength) {
        emailErrors.push(`Email must be less than ${rules.email.maxLength} characters`);
        }
        
        const emailPattern = rules.email.pattern || /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(data.email)) {
        emailErrors.push('Invalid email format');
        }
    }
    if (emailErrors.length) errors.email = emailErrors;

    // Password validation
    const passwordErrors: string[] = [];
    if (rules.password.required && !data.password) {
        passwordErrors.push('Password is required');
    } else if (data.password) {
        if (rules.password.minLength && data.password.length < rules.password.minLength) {
        passwordErrors.push(`Password must be at least ${rules.password.minLength} characters`);
        }
        
        if (rules.password.maxLength && data.password.length > rules.password.maxLength) {
        passwordErrors.push(`Password must be less than ${rules.password.maxLength} characters`);
        }
        
        if (rules.password.requireCapital && !/[A-Z]/.test(data.password)) {
        passwordErrors.push('Password must contain at least one capital letter');
        }
        
        if (rules.password.requireNumber && !/\d/.test(data.password)) {
        passwordErrors.push('Password must contain at least one number');
        }
        
        if (rules.password.requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(data.password)) {
        passwordErrors.push('Password must contain at least one special character');
        }
    }
    if (passwordErrors.length) errors.password = passwordErrors;

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Default validation rules
const defaultRules: ValidationRules = {
    email: {
        required: true,
        maxLength: 254, // Maximum length for email addresses according to RFC 5321
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
        required: true,
        minLength: 8,
        maxLength: 128,
        requireCapital: true,
        requireNumber: true,
        requireSpecialChar: true
    }
};

export const convertIntoCollectionItem = (item: any, geolocation: {lat: number, lng: number} | null | undefined) => {
    const newAvailableItem: CollectionItem = {
        id: item.id,
        newPrice: item.newprice,
        quantity: item.quantity,
        collectDay: item.collectday.toLowerCase(),
        collectTime: JSON.parse(item.collecttimerange).map((i: string) => i.split(' ')[1].slice(0, 5)).join('-'),
        menuItem: {
            name: item.menu.name,
            type: item.menu.type,
            description: item.menu.description,
            initialPrice: item.menu.initialprice,
            image: item.menu.image
        },
        branch: {
            address: item.menu.branch.address,
            votesNumber: item.menu.branch.votenumber | 0,
            rating: item.menu.branch.votenumber > 0 ? 
            Math.round(item.menu.branch.ratingsum / item.menu.branch.votesnumber * 100) / 100 : undefined,
            distance: !geolocation ? undefined :
            Number(calculateDistance(
                geolocation.lat, 
                geolocation.lng,
                Number(item.menu.branch.coordinates.split(',')[0].replace('(', '')),
                Number(item.menu.branch.coordinates.split(',')[1].replace(')', '')) 
            ).toFixed(2))
        },
        company: {
            name: item.menu.branch.company.name,
            logo: item.menu.branch.company.logo
        }
    }
    return newAvailableItem
}