export const mockData = {
  categories: [
    { id: "1", name: "Vegetable Seeds", count: 15, value: 125000, image: "🥬" },
    { id: "2", name: "Flower Seeds", count: 12, value: 85000, image: "🌸" },
    { id: "3", name: "Crop Seeds", count: 8, value: 95000, image: "🌾" },
    { id: "4", name: "Fruit Seeds", count: 6, value: 65000, image: "🍎" },
  ],
  
  stock: Array.from({ length: 40 }, (_, i) => ({
    id: `stock-${i + 1}`,
    name: `Seed Item ${i + 1}`,
    category: ["1", "2", "3", "4"][i % 4],
    quantity: Math.floor(Math.random() * 500) + 50,
    minQuantity: 50,
    batch: `BATCH-${2024}-${String(i + 1).padStart(3, "0")}`,
    expiry: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
    purchasePrice: Math.floor(Math.random() * 500) + 100,
    sellingPrice: Math.floor(Math.random() * 700) + 200,
  })),
  
  vendors: Array.from({ length: 20 }, (_, i) => ({
    id: `vendor-${i + 1}`,
    name: `Vendor ${i + 1}`,
    contact: `98765${String(i).padStart(5, "0")}`,
    gst: `22AAAAA${String(i).padStart(4, "0")}A1Z5`,
    address: `${i + 1} Vendor Street, City`,
    paymentTerms: ["Cash", "Credit 30", "Credit 45"][i % 3],
    outstanding: Math.floor(Math.random() * 50000),
  })),
  
  customers: Array.from({ length: 25 }, (_, i) => ({
    id: `customer-${i + 1}`,
    name: `Customer ${i + 1}`,
    contact: `87654${String(i).padStart(5, "0")}`,
    gst: `27BBBBB${String(i).padStart(4, "0")}B1Z5`,
    address: `${i + 1} Customer Road, Town`,
    creditLimit: Math.floor(Math.random() * 100000) + 50000,
    outstanding: Math.floor(Math.random() * 30000),
  })),
  
  purchases: Array.from({ length: 60 }, (_, i) => {
    const date = new Date(2024, Math.floor(Math.random() * 6) + 4, Math.floor(Math.random() * 28) + 1);
    const items = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, j) => ({
      itemId: `stock-${Math.floor(Math.random() * 40) + 1}`,
      quantity: Math.floor(Math.random() * 50) + 10,
      rate: Math.floor(Math.random() * 500) + 100,
    }));
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
    const gst = subtotal * 0.18;
    return {
      id: `PUR-${String(i + 1).padStart(4, "0")}`,
      vendorId: `vendor-${Math.floor(Math.random() * 20) + 1}`,
      date: date.toISOString(),
      items,
      subtotal,
      cgst: gst / 2,
      sgst: gst / 2,
      total: subtotal + gst,
      paid: Math.random() > 0.3 ? subtotal + gst : Math.floor(Math.random() * subtotal),
      status: Math.random() > 0.3 ? "paid" : "pending",
    };
  }),
  
  sales: Array.from({ length: 120 }, (_, i) => {
    const date = new Date(2024, Math.floor(Math.random() * 6) + 4, Math.floor(Math.random() * 28) + 1);
    const items = Array.from({ length: Math.floor(Math.random() * 4) + 1 }, (_, j) => ({
      itemId: `stock-${Math.floor(Math.random() * 40) + 1}`,
      quantity: Math.floor(Math.random() * 30) + 5,
      rate: Math.floor(Math.random() * 700) + 200,
    }));
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
    const gst = subtotal * 0.18;
    return {
      id: `INV-${String(i + 1).padStart(4, "0")}`,
      customerId: `customer-${Math.floor(Math.random() * 25) + 1}`,
      date: date.toISOString(),
      items,
      subtotal,
      cgst: gst / 2,
      sgst: gst / 2,
      total: subtotal + gst,
      paid: Math.random() > 0.2 ? subtotal + gst : Math.floor(Math.random() * subtotal),
      status: Math.random() > 0.2 ? "paid" : "pending",
    };
  }),
  
  employees: Array.from({ length: 15 }, (_, i) => ({
    id: `emp-${String(i + 1).padStart(3, "0")}`,
    name: `Employee ${i + 1}`,
    role: ["Manager", "Sales Executive", "Stock Keeper", "Accountant"][i % 4],
    department: ["Sales", "Operations", "Accounts"][i % 3],
    contact: `99887${String(i).padStart(5, "0")}`,
    email: `employee${i + 1}@agroerp.com`,
    joiningDate: new Date(2022 + (i % 3), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
    salary: Math.floor(Math.random() * 30000) + 20000,
    status: "active",
  })),
  
  attendance: [],
  
  company: {
    name: "Agro Seeds Enterprise",
    gst: "27AABCU9603R1ZV",
    address: "123 Agriculture Road, Farming District, State - 123456",
    phone: "1800-123-4567",
    email: "info@agroseeds.com",
    logo: "🌱",
    financialYear: "2024-2025",
  },
};
