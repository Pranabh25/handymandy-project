import { demoConfig } from "../../src/config/site";

export type SeedAddress = {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  type: "HOME" | "WORK" | "OTHER";
  isDefault: boolean;
};

export type SeedCustomer = {
  key: string;
  name: string;
  phone: string;
  email: string;
  daysAgo: number;
  addresses: SeedAddress[];
};

const addr = (
  fullName: string,
  phone: string,
  line1: string,
  line2: string | undefined,
  landmark: string | undefined,
  city: string,
  state: string,
  pincode: string,
): SeedAddress => ({ fullName, phone, line1, line2, landmark, city, state, pincode, type: "HOME", isDefault: true });

const c = (key: string, name: string, phone: string, email: string, daysAgo: number, a: SeedAddress): SeedCustomer => ({
  key,
  name,
  phone,
  email,
  daysAgo,
  addresses: [a],
});

export const DEMO_CUSTOMER_KEY = "ananya";

export const customers: SeedCustomer[] = [
  {
    key: DEMO_CUSTOMER_KEY,
    name: demoConfig.customer.name,
    phone: demoConfig.customer.phone,
    email: demoConfig.customer.email,
    daysAgo: 175,
    addresses: [
      {
        fullName: demoConfig.customer.name,
        phone: demoConfig.customer.phone,
        line1: "Flat 302, Prestige Lakeside Habitat",
        line2: "Varthur Main Road, Gunjur",
        landmark: "Opposite Gunjur Lake",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560087",
        type: "HOME",
        isDefault: true,
      },
      {
        fullName: demoConfig.customer.name,
        phone: demoConfig.customer.phone,
        line1: "4th Floor, Tower B, Embassy Tech Village",
        line2: "Outer Ring Road, Devarabisanahalli",
        landmark: "Near Flipkart signal",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560103",
        type: "WORK",
        isDefault: false,
      },
    ],
  },
  c("rahul", "Rahul Khanna", "9820145567", "rahul.khanna@example.in", 168,
    addr("Rahul Khanna", "9820145567", "B-1204, Oberoi Splendor", "JVLR, Jogeshwari East", "Near Majas Depot", "Mumbai", "Maharashtra", "400060")),
  c("priya", "Priya Venkataraman", "9840332198", "priya.venkat@example.in", 160,
    addr("Priya Venkataraman", "9840332198", "12, 3rd Cross Street", "Besant Nagar", "Near Ashtalakshmi Temple", "Chennai", "Tamil Nadu", "600090")),
  c("aditya", "Aditya Joshi", "9765409812", "aditya.joshi@example.in", 151,
    addr("Aditya Joshi", "9765409812", "Flat 6, Sai Krupa Apartments", "Prabhat Road, Erandwane", undefined, "Pune", "Maharashtra", "411004")),
  c("fatima", "Fatima Sheikh", "9001276543", "fatima.sheikh@example.in", 143,
    addr("Fatima Sheikh", "9001276543", "C-17, Malviya Nagar", "Sector 3", "Behind Gaurav Tower", "Jaipur", "Rajasthan", "302017")),
  c("arjun", "Arjun Menon", "9447128834", "arjun.menon@example.in", 131,
    addr("Arjun Menon", "9447128834", "Kizhakkedath House, TC 24/1180", "Panampilly Nagar", "Near Avenue Centre", "Kochi", "Kerala", "682036")),
  c("sneha", "Sneha Chatterjee", "9831067720", "sneha.c@example.in", 122,
    addr("Sneha Chatterjee", "9831067720", "45/2, Southern Avenue", "Lake Market", "Near Deshapriya Park", "Kolkata", "West Bengal", "700029")),
  c("vikram", "Vikram Sethi", "9811554403", "vikram.sethi@example.in", 110,
    addr("Vikram Sethi", "9811554403", "H.No. 2231, Sector 21-C", undefined, "Near Sector 21 market", "Chandigarh", "Chandigarh", "160022")),
  c("kavya", "Kavya Reddy", "9989012345", "kavya.reddy@example.in", 97,
    addr("Kavya Reddy", "9989012345", "Plot 88, Road No. 12", "Banjara Hills", "Near Taj Krishna", "Hyderabad", "Telangana", "500034")),
  c("mehul", "Mehul Shah", "9824098761", "mehul.shah@example.in", 86,
    addr("Mehul Shah", "9824098761", "A-503, Shivalik Heights", "Satellite Road, Jodhpur Village", "Near Star Bazaar", "Ahmedabad", "Gujarat", "380015")),
  c("ishita", "Ishita Srivastava", "7897654123", "ishita.s@example.in", 74,
    addr("Ishita Srivastava", "7897654123", "5/112, Vikas Khand", "Gomti Nagar", "Near Patrakarpuram crossing", "Lucknow", "Uttar Pradesh", "226010")),
  c("rohit", "Rohit Patidar", "8962314570", "rohit.patidar@example.in", 63,
    addr("Rohit Patidar", "8962314570", "22, Scheme No. 54", "Vijay Nagar", "Near C21 Mall", "Indore", "Madhya Pradesh", "452010")),
  c("sanjana", "Sanjana Mohapatra", "7008123456", "sanjana.m@example.in", 55,
    addr("Sanjana Mohapatra", "7008123456", "Plot 311, Saheed Nagar", undefined, "Near Maharishi College", "Bhubaneswar", "Odisha", "751007")),
  c("karan", "Karan Oberoi", "9910276654", "karan.oberoi@example.in", 44,
    addr("Karan Oberoi", "9910276654", "Tower 7, Flat 1802, DLF Park Place", "Sector 54, Golf Course Road", undefined, "Gurugram", "Haryana", "122002")),
  c("lakshmi", "Lakshmi Narayanan", "6381457290", "lakshmi.n@example.in", 32,
    addr("Lakshmi Narayanan", "6381457290", "18, Race Course Road", "Gopalapuram", "Opposite Codissia Hall", "Coimbatore", "Tamil Nadu", "641018")),
];
