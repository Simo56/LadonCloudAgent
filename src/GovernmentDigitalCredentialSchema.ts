import * as initConfigurationData from "./configurationData.json";

export const governmentDigitalCredentialSchema = {
    attrNames: ['full_name', 'date_of_birth', 'address', 'government_id', 'contact_info'],
    issuerId: initConfigurationData.BCOVRIN_TEST_STARTOFTHECOMPLETEID + initConfigurationData.DID,
    name: 'Ladon Schema for Government Services SSI',
    version: '1.0.0',
};