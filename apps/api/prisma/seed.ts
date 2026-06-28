// Path: apps/api/prisma/seed.ts
//
// Seeds the database with:
//   1. Cities (10)
//   2. YAANA_ADMIN user
//   3. Test Companies (3)
//   4. Corporate users per company
//   5. Vehicles (8)
//   6. Sample Bookings (20, spread across 6 months)
//   7. Sample Invoices + Payments
//
// Run: pnpm db:seed
// Safe to re-run — uses upsert, won't duplicate data.

import 'dotenv/config';
import {
  PrismaClient,
  Role,
  UserStatus,
  CompanyStatus,
  BookingStatus,
  ServiceType,
  InvoiceStatus,
  PaymentStatus,
  VehicleCategory,
} from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// ── Helpers ───────────────────────────────────────────────────────────

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function monthsAgo(n: number): Date {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d;
}

let bookingSeq = 1;
function nextRefNo(): string {
  return `YT-2025-${String(bookingSeq++).padStart(4, '0')}`;
}

let invoiceSeq = 1;
function nextInvNo(): string {
  return `YT-INV-2025-${String(invoiceSeq++).padStart(4, '0')}`;
}

// ── Seed data ─────────────────────────────────────────────────────────

const CITIES = [
  {
    name: 'Mumbai',
    state: 'Maharashtra',
    slug: 'mumbai',
    hasOffice: true,
    officeType: 'HQ' as const,
  },
  {
    name: 'Bengaluru',
    state: 'Karnataka',
    slug: 'bengaluru',
    hasOffice: true,
    officeType: 'BRANCH' as const,
  },
  {
    name: 'New Delhi',
    state: 'Delhi',
    slug: 'new-delhi',
    hasOffice: true,
    officeType: 'BRANCH' as const,
  },
  {
    name: 'Hyderabad',
    state: 'Telangana',
    slug: 'hyderabad',
    hasOffice: false,
    officeType: null,
  },
  {
    name: 'Chennai',
    state: 'Tamil Nadu',
    slug: 'chennai',
    hasOffice: false,
    officeType: null,
  },
  {
    name: 'Pune',
    state: 'Maharashtra',
    slug: 'pune',
    hasOffice: false,
    officeType: null,
  },
  {
    name: 'Jaipur',
    state: 'Rajasthan',
    slug: 'jaipur',
    hasOffice: false,
    officeType: null,
  },
  {
    name: 'Goa',
    state: 'Goa',
    slug: 'goa',
    hasOffice: false,
    officeType: null,
  },
  {
    name: 'Ahmedabad',
    state: 'Gujarat',
    slug: 'ahmedabad',
    hasOffice: false,
    officeType: null,
  },
  {
    name: 'Kochi',
    state: 'Kerala',
    slug: 'kochi',
    hasOffice: false,
    officeType: null,
  },
];

const COMPANIES_DATA = [
  {
    name: 'Acme Technologies Pvt. Ltd.',
    gstNumber: '27AAPFU0939F1ZV',
    email: 'travel@acme.in',
    phone: '+91 98765 00001',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    adminEmail: 'rajesh@acme.in',
    adminName: 'Rajesh Kumar',
    userEmail: 'priya@acme.in',
    userName: 'Priya Sharma',
  },
  {
    name: 'Infosync Solutions Pvt. Ltd.',
    gstNumber: '29AABCI1234D1ZK',
    email: 'admin@infosync.in',
    phone: '+91 98765 00002',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    adminEmail: 'amit@infosync.in',
    adminName: 'Amit Verma',
    userEmail: 'sneha@infosync.in',
    userName: 'Sneha Patel',
  },
  {
    name: 'Horizon Capital Pvt. Ltd.',
    gstNumber: '07AABCH5678E1ZP',
    email: 'corp@horizoncap.in',
    phone: '+91 98765 00003',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    adminEmail: 'vivek@horizoncap.in',
    adminName: 'Vivek Sharma',
    userEmail: 'meera@horizoncap.in',
    userName: 'Meera Nair',
  },
];

async function main() {
  console.log('\n🌱  Starting database seed...\n');

  // ── 1. Cities ──────────────────────────────────────────────────────
  console.log('📍  Seeding cities...');
  const cityIds: Record<string, string> = {};

  for (const city of CITIES) {
    const record = await prisma.city.upsert({
      where: { slug: city.slug },
      update: {
        name: city.name,
        state: city.state,
        hasOffice: city.hasOffice,
        officeType: city.officeType,
        isActive: true,
      },
      create: {
        name: city.name,
        state: city.state,
        slug: city.slug,
        isActive: true,
        hasOffice: city.hasOffice,
        officeType: city.officeType,
      },
    });
    cityIds[city.slug] = record.id;
    console.log(`   ✓ ${city.name}`);
  }

  // ── 2. YAANA_ADMIN ─────────────────────────────────────────────────
  console.log('\n👤  Seeding Yana Admin...');
  const adminHash = await bcrypt.hash('Admin@1234', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@yanatransit.in' },
    update: { passwordHash: adminHash, status: UserStatus.ACTIVE },
    create: {
      name: 'Yana Admin',
      email: 'admin@yanatransit.in',
      passwordHash: adminHash,
      role: Role.YAANA_ADMIN,
      status: UserStatus.ACTIVE,
      companyId: null,
    },
  });
  console.log(`   ✓ ${admin.email}`);

  // ── 3. Companies + Users ───────────────────────────────────────────
  console.log('\n🏢  Seeding companies and users...');
  const companyIds: string[] = [];
  const userIds: string[] = [];
  const corpAdminPassword = await bcrypt.hash('Corp@1234', 12);
  const corpUserPassword = await bcrypt.hash('User@1234', 12);

  for (const c of COMPANIES_DATA) {
    const existing = await prisma.company.findFirst({
      where: { email: c.email },
    });
    const company = await prisma.company.upsert({
      where: { id: existing?.id ?? 'none' },
      update: { name: c.name, status: CompanyStatus.ACTIVE },
      create: {
        name: c.name,
        gstNumber: c.gstNumber,
        email: c.email,
        phone: c.phone,
        city: c.city,
        state: c.state,
        pincode: c.pincode,
        status: CompanyStatus.ACTIVE,
        contractStart: monthsAgo(6),
      },
    });
    companyIds.push(company.id);

    const corpAdmin = await prisma.user.upsert({
      where: { email: c.adminEmail },
      update: { companyId: company.id, status: UserStatus.ACTIVE },
      create: {
        name: c.adminName,
        email: c.adminEmail,
        passwordHash: corpAdminPassword,
        role: Role.CORPORATE_ADMIN,
        status: UserStatus.ACTIVE,
        companyId: company.id,
        createdById: admin.id,
      },
    });
    const corpUser = await prisma.user.upsert({
      where: { email: c.userEmail },
      update: { companyId: company.id, status: UserStatus.ACTIVE },
      create: {
        name: c.userName,
        email: c.userEmail,
        passwordHash: corpUserPassword,
        role: Role.CORPORATE_USER,
        status: UserStatus.ACTIVE,
        companyId: company.id,
        createdById: admin.id,
      },
    });
    userIds.push(corpAdmin.id, corpUser.id);
    console.log(`   ✓ ${company.name}`);
  }

  // ── 4. Vehicles ────────────────────────────────────────────────────
  console.log('\n🚗  Seeding vehicles...');
  const vehicleData = [
    {
      name: 'Toyota Innova Crysta',
      category: VehicleCategory.SUV,
      seats: 7,
      baseCityId: cityIds['mumbai'],
      registration: 'MH01AB1234',
    },
    {
      name: 'Maruti Ertiga',
      category: VehicleCategory.MUV,
      seats: 7,
      baseCityId: cityIds['mumbai'],
      registration: 'MH01AB5678',
    },
    {
      name: 'Honda City',
      category: VehicleCategory.SEDAN,
      seats: 5,
      baseCityId: cityIds['mumbai'],
      registration: 'MH01CD1234',
    },
    {
      name: 'Toyota Innova HyCross',
      category: VehicleCategory.PREMIUM_SUV,
      seats: 7,
      baseCityId: cityIds['bengaluru'],
      registration: 'KA01EF1234',
    },
    {
      name: 'Kia Carnival',
      category: VehicleCategory.PREMIUM,
      seats: 8,
      baseCityId: cityIds['bengaluru'],
      registration: 'KA01EF5678',
    },
    {
      name: 'Mercedes-Benz E-Class',
      category: VehicleCategory.LUXURY,
      seats: 4,
      baseCityId: cityIds['new-delhi'],
      registration: 'DL01GH1234',
    },
    {
      name: 'Toyota Camry',
      category: VehicleCategory.LUXURY,
      seats: 4,
      baseCityId: cityIds['new-delhi'],
      registration: 'DL01GH5678',
    },
    {
      name: 'Maruti Dzire',
      category: VehicleCategory.SEDAN,
      seats: 4,
      baseCityId: cityIds['new-delhi'],
      registration: 'DL01IJ1234',
    },
  ];
  const vehicleIds: string[] = [];
  for (const v of vehicleData) {
    const vehicle = await prisma.vehicle.upsert({
      where: { registration: v.registration },
      update: { name: v.name, isActive: true },
      create: { ...v, isActive: true },
    });
    vehicleIds.push(vehicle.id);
    console.log(`   ✓ ${v.name}`);
  }

  // ── 5. Bookings ────────────────────────────────────────────────────
  console.log('\n📋  Seeding bookings...');
  await prisma.payment.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.booking.deleteMany({});

  const bookingsToCreate = [
    // This month
    {
      ci: 0,
      ui: 0,
      vi: 0,
      city: 'mumbai',
      svc: ServiceType.CHAUFFEUR_DRIVEN,
      st: BookingStatus.ONGOING,
      start: daysAgo(2),
      end: daysAgo(0),
      qa: 8500,
      fa: 8500,
      cn: 'Ramesh Yadav',
      cp: '+91 98001 11001',
      db: 2,
    },
    {
      ci: 1,
      ui: 2,
      vi: 3,
      city: 'bengaluru',
      svc: ServiceType.AIRPORT_TRANSFER,
      st: BookingStatus.CONFIRMED,
      start: daysAgo(1),
      end: daysAgo(0),
      qa: 2800,
      fa: 2800,
      cn: 'Suresh Kumar',
      cp: '+91 98001 11002',
      db: 1,
    },
    {
      ci: 2,
      ui: 4,
      vi: 5,
      city: 'new-delhi',
      svc: ServiceType.CORPORATE_LEASE,
      st: BookingStatus.ENQUIRY,
      start: daysAgo(0),
      end: daysAgo(-7),
      qa: 45000,
      fa: undefined,
      cn: undefined,
      cp: undefined,
      db: 0,
    },
    {
      ci: 0,
      ui: 1,
      vi: 2,
      city: 'mumbai',
      svc: ServiceType.OUTSTATION,
      st: BookingStatus.COMPLETED,
      start: daysAgo(5),
      end: daysAgo(3),
      qa: 12000,
      fa: 12000,
      cn: 'Vijay Singh',
      cp: '+91 98001 11003',
      db: 5,
    },
    {
      ci: 1,
      ui: 3,
      vi: 4,
      city: 'bengaluru',
      svc: ServiceType.ETS,
      st: BookingStatus.COMPLETED,
      start: daysAgo(6),
      end: daysAgo(5),
      qa: 6500,
      fa: 6500,
      cn: 'Mohan Das',
      cp: '+91 98001 11004',
      db: 6,
    },
    // Last month
    {
      ci: 2,
      ui: 5,
      vi: 6,
      city: 'new-delhi',
      svc: ServiceType.CHAUFFEUR_DRIVEN,
      st: BookingStatus.COMPLETED,
      start: daysAgo(35),
      end: daysAgo(33),
      qa: 9200,
      fa: 9200,
      cn: 'Arjun Reddy',
      cp: '+91 98001 11005',
      db: 35,
    },
    {
      ci: 0,
      ui: 0,
      vi: 1,
      city: 'mumbai',
      svc: ServiceType.AIRPORT_TRANSFER,
      st: BookingStatus.COMPLETED,
      start: daysAgo(38),
      end: daysAgo(38),
      qa: 2200,
      fa: 2200,
      cn: 'Ramesh Yadav',
      cp: '+91 98001 11001',
      db: 38,
    },
    {
      ci: 1,
      ui: 2,
      vi: 4,
      city: 'bengaluru',
      svc: ServiceType.EVENTS,
      st: BookingStatus.COMPLETED,
      start: daysAgo(42),
      end: daysAgo(40),
      qa: 18000,
      fa: 18000,
      cn: 'Suresh Kumar',
      cp: '+91 98001 11002',
      db: 42,
    },
    {
      ci: 2,
      ui: 4,
      vi: 5,
      city: 'new-delhi',
      svc: ServiceType.CORPORATE_LEASE,
      st: BookingStatus.COMPLETED,
      start: daysAgo(45),
      end: daysAgo(38),
      qa: 52000,
      fa: 52000,
      cn: 'Arjun Reddy',
      cp: '+91 98001 11005',
      db: 45,
    },
    // Month 2
    {
      ci: 0,
      ui: 1,
      vi: 0,
      city: 'mumbai',
      svc: ServiceType.OUTSTATION,
      st: BookingStatus.COMPLETED,
      start: daysAgo(65),
      end: daysAgo(63),
      qa: 14500,
      fa: 14500,
      cn: 'Vijay Singh',
      cp: '+91 98001 11003',
      db: 65,
    },
    {
      ci: 1,
      ui: 3,
      vi: 3,
      city: 'bengaluru',
      svc: ServiceType.CHAUFFEUR_DRIVEN,
      st: BookingStatus.COMPLETED,
      start: daysAgo(68),
      end: daysAgo(66),
      qa: 7800,
      fa: 7800,
      cn: 'Mohan Das',
      cp: '+91 98001 11004',
      db: 68,
    },
    {
      ci: 2,
      ui: 5,
      vi: 7,
      city: 'new-delhi',
      svc: ServiceType.AIRPORT_TRANSFER,
      st: BookingStatus.COMPLETED,
      start: daysAgo(72),
      end: daysAgo(72),
      qa: 1800,
      fa: 1800,
      cn: 'Deepak Sharma',
      cp: '+91 98001 11006',
      db: 72,
    },
    // Month 3
    {
      ci: 0,
      ui: 0,
      vi: 2,
      city: 'mumbai',
      svc: ServiceType.ETS,
      st: BookingStatus.COMPLETED,
      start: daysAgo(95),
      end: daysAgo(94),
      qa: 5500,
      fa: 5500,
      cn: 'Ramesh Yadav',
      cp: '+91 98001 11001',
      db: 95,
    },
    {
      ci: 1,
      ui: 2,
      vi: 4,
      city: 'bengaluru',
      svc: ServiceType.EVENTS,
      st: BookingStatus.COMPLETED,
      start: daysAgo(98),
      end: daysAgo(96),
      qa: 22000,
      fa: 22000,
      cn: 'Suresh Kumar',
      cp: '+91 98001 11002',
      db: 98,
    },
    {
      ci: 2,
      ui: 4,
      vi: 6,
      city: 'new-delhi',
      svc: ServiceType.CORPORATE_LEASE,
      st: BookingStatus.COMPLETED,
      start: daysAgo(100),
      end: daysAgo(93),
      qa: 48000,
      fa: 48000,
      cn: 'Arjun Reddy',
      cp: '+91 98001 11005',
      db: 100,
    },
    // Month 4
    {
      ci: 0,
      ui: 1,
      vi: 1,
      city: 'mumbai',
      svc: ServiceType.CHAUFFEUR_DRIVEN,
      st: BookingStatus.COMPLETED,
      start: daysAgo(128),
      end: daysAgo(126),
      qa: 8800,
      fa: 8800,
      cn: 'Vijay Singh',
      cp: '+91 98001 11003',
      db: 128,
    },
    {
      ci: 1,
      ui: 3,
      vi: 3,
      city: 'bengaluru',
      svc: ServiceType.AIRPORT_TRANSFER,
      st: BookingStatus.COMPLETED,
      start: daysAgo(132),
      end: daysAgo(132),
      qa: 3200,
      fa: 3200,
      cn: 'Mohan Das',
      cp: '+91 98001 11004',
      db: 132,
    },
    {
      ci: 2,
      ui: 5,
      vi: 5,
      city: 'new-delhi',
      svc: ServiceType.OUTSTATION,
      st: BookingStatus.COMPLETED,
      start: daysAgo(135),
      end: daysAgo(133),
      qa: 16500,
      fa: 16500,
      cn: 'Deepak Sharma',
      cp: '+91 98001 11006',
      db: 135,
    },
    // Month 5
    {
      ci: 0,
      ui: 0,
      vi: 0,
      city: 'mumbai',
      svc: ServiceType.ETS,
      st: BookingStatus.COMPLETED,
      start: daysAgo(162),
      end: daysAgo(161),
      qa: 4800,
      fa: 4800,
      cn: 'Ramesh Yadav',
      cp: '+91 98001 11001',
      db: 162,
    },
    {
      ci: 1,
      ui: 2,
      vi: 4,
      city: 'bengaluru',
      svc: ServiceType.CORPORATE_LEASE,
      st: BookingStatus.COMPLETED,
      start: daysAgo(165),
      end: daysAgo(158),
      qa: 38000,
      fa: 38000,
      cn: 'Suresh Kumar',
      cp: '+91 98001 11002',
      db: 165,
    },
  ];

  const createdBookings: {
    id: string;
    companyId: string;
    amount: number;
    status: BookingStatus;
    createdAt: Date;
  }[] = [];

  for (const b of bookingsToCreate) {
    const companyId = companyIds[b.ci];
    const userId = userIds[b.ui];
    const vehicleId = vehicleIds[b.vi];
    const cityId = cityIds[b.city];
    const createdAt = daysAgo(b.db);

    const booking = await prisma.booking.create({
      data: {
        referenceNo: nextRefNo(),
        status: b.st,
        serviceType: b.svc,
        userId,
        companyId,
        pickupCityId: cityId,
        startDate: b.start,
        endDate: b.end,
        vehicleId: b.st !== BookingStatus.ENQUIRY ? vehicleId : undefined,
        chauffeurName: b.cn,
        chauffeurPhone: b.cp,
        quotedAmount: b.qa,
        finalAmount: b.fa,
        createdAt,
        updatedAt: createdAt,
      },
    });
    createdBookings.push({
      id: booking.id,
      companyId,
      amount: b.fa ?? 0,
      status: b.st,
      createdAt,
    });
    console.log(`   ✓ ${booking.referenceNo} — ${b.svc} — ${b.st}`);
  }

  // ── 6. Invoices + Payments ─────────────────────────────────────────
  console.log('\n🧾  Seeding invoices and payments...');

  const completedBookings = createdBookings.filter(
    (b) => b.status === BookingStatus.COMPLETED && b.amount > 0
  );

  for (const b of completedBookings) {
    const subtotal = b.amount;
    const cgst = parseFloat((subtotal * 0.09).toFixed(2));
    const sgst = parseFloat((subtotal * 0.09).toFixed(2));
    const total = subtotal + cgst + sgst;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: nextInvNo(),
        status: InvoiceStatus.PAID,
        bookingId: b.id,
        companyId: b.companyId,
        subtotal,
        cgst,
        sgst,
        igst: 0,
        total,
        sacCode: '996411',
        gstType: 'CGST_SGST',
        issueDate: b.createdAt,
        dueDate: new Date(b.createdAt.getTime() + 15 * 24 * 60 * 60 * 1000),
        paidAt: new Date(b.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000),
        createdAt: b.createdAt,
        updatedAt: b.createdAt,
      },
    });

    await prisma.payment.create({
      data: {
        invoiceId: invoice.id,
        amount: total,
        status: PaymentStatus.PAID,
        method: 'bank_transfer',
        referenceNo: `UTR${Math.floor(
          Math.random() * 9000000000 + 1000000000
        )}`,
        paidAt: invoice.paidAt,
        createdAt: b.createdAt,
        updatedAt: b.createdAt,
      },
    });
    console.log(
      `   ✓ ${invoice.invoiceNumber} — ₹${total.toLocaleString('en-IN')}`
    );
  }

  const totalPaid = completedBookings.reduce((s, b) => s + b.amount * 1.18, 0);

  console.log('\n✅  Seed complete!\n');
  console.log('─────────────────────────────────────────────────');
  console.log(`  YAANA_ADMIN    admin@yanatransit.in  / Admin@1234`);
  console.log(`  CORP_ADMIN[0]  rajesh@acme.in        / Corp@1234`);
  console.log(`  CORP_ADMIN[1]  amit@infosync.in      / Corp@1234`);
  console.log(`  CORP_ADMIN[2]  vivek@horizoncap.in   / Corp@1234`);
  console.log('─────────────────────────────────────────────────');
  console.log(`  Bookings : ${bookingsToCreate.length}`);
  console.log(`  Invoices : ${completedBookings.length}`);
  console.log(
    `  Revenue  : ₹${totalPaid.toLocaleString('en-IN', {
      maximumFractionDigits: 0,
    })}`
  );
  console.log('─────────────────────────────────────────────────\n');
}

main()
  .catch((e) => {
    console.error('❌  Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// ─── Seed Output ─────────────────────────────────────────────────

//   🌱  Starting Yana Transit database seed...

// 📍  Seeding cities...
//     ✓ 8 cities seeded

//     👤  Seeding Yana Admin user...
//     ✓ Admin: admin@yanatransit.in  |  Password: Admin@1234

// 🏢  Seeding test company...
//     ✓ Company: Infosys Limited (id: seed-company-infosys)

// 👔  Seeding corporate admin user...
//     ✓ Corp Admin: rahul.sharma@infosys.com  |  Status: PENDING

// 🧑  Seeding corporate user...
// ✓ Corp User: priya.mehta@infosys.com  |  Status: PENDING

// 🚗  Seeding sample vehicles...
//     ✓ 5 vehicles seeded

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ✅  Seed complete!

// 🔑  Login credentials (ready to use):
//     Email    : admin@yanatransit.in
//     Password : Admin@1234
//     Role     : YAANA_ADMIN

//     🏢  Test company created:
//     Name     : Infosys Limited
//     ID       : seed-company-infosys

//     👥  Corporate users (PENDING — activate via API):
//     rahul.sharma@infosys.com  →  CORPORATE_ADMIN
//     priya.mehta@infosys.com    →  CORPORATE_USER

// ⚠️   Change the admin password after first login!
// ──────────────────────────────────────────────────────────────────
