export interface Medicine {
    name: string;
    owner?: string;
    creation?: string;
    modified?: string;
    modified_by?: string;
    docstatus?: number;
    idx?: number;
    source_id?: string;
    brand_name: string;
    type?: string;
    is_discontinued: number;
    manufacturer_name?: string;
    salt_composition?: string;
    short_composition1?: string;
    dosage_form?: string;
    pack_size_label?: string;
    price: number;
    is_generic: number;
    image?: string;
    doctype?: string;
    description?: string;
    affiliate_link?: string;
}
