export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface ApiError {
    message: string;
    status?: number;
}




export interface User {
    id: number;
    name: string;
    email: string;
}

export interface RegisterRes {
    message: string;
    error?: string;
}


export interface PropertyListResponse {
    success: boolean;
    counts: Counts;
    data: PaginatedProperties;
    filters: Filters;
}


export interface Counts {
    total: number;
    filtered: number;
    showing: number;
}

export interface PaginatedProperties {
    current_page: number;
    data: Property[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}


export type PropertyPagination = PaginatedProperties;


export interface Property {
    id: number;
    unique_code: string;
    title: string;
    slug: string;
    address: string;

    rooms: string;
    bathrooms: string;
    formatted_rooms: string;
    formatted_bathrooms: string;

    property_size: string;
    formatted_size: string;

    property_price: string;
    formatted_price: string;

    furnishing_type: string | null;

    latitude: string;
    longitude: string;

    is_featured: string;
    is_published: number;

    rating: number | null;
    wishlist: boolean;

    created_at: string;
    updated_at: string;

    property_images: string[];

    agents: Agent;
    property_type: PropertyType;
}

export interface Agent {
    id: number;
    name: string;
    email: string;
    mobile: string;
    alter_mobile: string | null;
    whatsapp: string;
    public_email: string | null;
    public_mobile: string | null;
    profile_url: string;
}


export interface PropertyType {
    id: number;
    name: string;
}


export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}


export interface PropertyListRequest {
    search?: string;
    category_id?: number;
    property_type_id?: number;
    per_page?: number;
    page?: number;
}


export interface Filters {
    property_types: FilterPropertyType[];
}

export interface FilterPropertyType {
    id: number;
    name: string;
    count: number;
}


export interface OTPMailRequest {
    mail: string;
}

export interface OTPMailVerify {
    mail: string;
    otp: string
}


export interface OTPSmsRequest {
    mobile: string;
}

export interface OTPSmsVerify {
    mobile: string;
    otp: string
}

export interface CorporateRegisterRequest {
    name: string;
    email: string;
    mobile: string;
    organization_name: string;
    designation: string;
    password: string;
    confirm_password: string;
}

