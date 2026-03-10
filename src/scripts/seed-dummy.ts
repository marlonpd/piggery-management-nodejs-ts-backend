import bcryptjs from 'bcryptjs';
import mongoose from 'mongoose';
import Accounting from '../models/accounting';
import Event from '../models/event';
import FeedInventory from '../models/feed_inventory';
import FeedingGuide from '../models/feeding_guide';
import Livestock from '../models/livestock';
import Note from '../models/note';
import Raise from '../models/raise';
import Reminder from '../models/reminder';
import SowHistory from '../models/sow_history';
import User from '../models/user';

const DB_URL = process.env.DB_URL ?? '';

const DEMO_USERS = [
  {
    name: 'Demo Owner',
    email: 'demo.owner@piggery.local',
    password: 'Passw0rd!',
    role: 'owner',
  },
  {
    name: 'Demo Manager',
    email: 'demo.manager@piggery.local',
    password: 'Passw0rd!',
    role: 'manager',
  },
  {
    name: 'Demo Staff',
    email: 'demo.staff@piggery.local',
    password: 'Passw0rd!',
    role: 'staff',
  },
] as const;

async function upsertDemoUsers() {
  const hashedPassword = await bcryptjs.hash('Passw0rd!', 8);

  const users = [] as any[];
  for (const user of DEMO_USERS) {
    const record = await User.findOneAndUpdate(
      { email: user.email },
      {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
        security_code: '',
      },
      { new: true, upsert: true },
    );
    users.push(record);
  }

  return users;
}

async function clearOwnerData(ownerId: mongoose.Types.ObjectId) {
  const raises = await Raise.find({ user: ownerId }, { _id: 1 });
  const raiseIds = raises.map((item) => item._id);

  if (raiseIds.length > 0) {
    await Promise.all([
      Livestock.deleteMany({ raise_id: { $in: raiseIds } }),
      Event.deleteMany({ raise_id: { $in: raiseIds } }),
      Note.deleteMany({ raise_id: { $in: raiseIds } }),
      Accounting.deleteMany({ raise_id: { $in: raiseIds } }),
      SowHistory.deleteMany({ raise_id: { $in: raiseIds } }),
      FeedingGuide.deleteMany({ raise_id: { $in: raiseIds } }),
    ]);
  }

  await Promise.all([
    Raise.deleteMany({ user: ownerId }),
    FeedInventory.deleteMany({ user_id: ownerId }),
    Reminder.deleteMany({ user_id: ownerId }),
  ]);
}

async function seedOwnerDomainData(ownerId: mongoose.Types.ObjectId) {
  const today = new Date();
  const day = 24 * 60 * 60 * 1000;

  const [raiseA, raiseB] = await Raise.create([
    {
      raise_type: 'fattener',
      head_count: 12,
      name: 'Batch Alpha',
      breed: 'Large White',
      hog_pen: 'A1',
      birth_date: new Date(today.getTime() - day * 75),
      dam_no: 3,
      sire_no: 1,
      ave_size_of_litter_dam: 10,
      teats_count: 14,
      rev_to: 'market',
      user: ownerId,
    },
    {
      raise_type: 'sow',
      head_count: 8,
      name: 'Breeder Group B',
      breed: 'Landrace',
      hog_pen: 'B2',
      birth_date: new Date(today.getTime() - day * 160),
      dam_no: 2,
      sire_no: 1,
      ave_size_of_litter_dam: 11,
      teats_count: 14,
      rev_to: 'farm',
      user: ownerId,
    },
  ]);

  await Livestock.create([
    { raise_id: raiseA._id, name: 'AL-001', weight: 34.5, birth_date: new Date(today.getTime() - day * 70) },
    { raise_id: raiseA._id, name: 'AL-002', weight: 31.2, birth_date: new Date(today.getTime() - day * 68) },
    { raise_id: raiseA._id, name: 'AL-003', weight: 29.7, birth_date: new Date(today.getTime() - day * 69) },
    { raise_id: raiseB._id, name: 'BR-001', weight: 72.8, birth_date: new Date(today.getTime() - day * 150) },
    { raise_id: raiseB._id, name: 'BR-002', weight: 68.1, birth_date: new Date(today.getTime() - day * 148) },
  ]);

  await Event.create([
    { raise_id: raiseA._id, title: 'Deworming Round 1', event_date: new Date(today.getTime() + day * 2) },
    { raise_id: raiseA._id, title: 'Weight Check', event_date: new Date(today.getTime() + day * 5) },
    { raise_id: raiseB._id, title: 'Breeding Cycle Review', event_date: new Date(today.getTime() + day * 4) },
    { raise_id: raiseB._id, title: 'Pen Disinfection', event_date: new Date(today.getTime() - day * 3) },
  ]);

  await Note.create([
    { raise_id: raiseA._id, title: 'Feed change', description: 'Shifted to grower pellets this week.' },
    { raise_id: raiseA._id, title: 'Health status', description: 'No respiratory issues observed.' },
    { raise_id: raiseB._id, title: 'Breeding prep', description: 'Added mineral supplement to ration.' },
  ]);

  await Accounting.create([
    { raise_id: raiseA._id, description: 'Starter feed purchase', entry_type: 'expense', amount: 4800 },
    { raise_id: raiseA._id, description: 'Vaccine supplies', entry_type: 'expense', amount: 1500 },
    { raise_id: raiseA._id, description: 'Sold 2 hogs', entry_type: 'sales', amount: 9400 },
    { raise_id: raiseB._id, description: 'Breeding services income', entry_type: 'sales', amount: 5200 },
    { raise_id: raiseB._id, description: 'Pen repairs', entry_type: 'expense', amount: 2300 },
  ]);

  await SowHistory.create([
    {
      raise_id: raiseA._id,
      boar_name: 'Atlas',
      boar_no: 7,
      boar_breed: 'Yorkshire',
      boar_owner: 'Partner Farm',
      breed_date: new Date(today.getTime() - day * 30),
      estimated_farrowed_date: new Date(today.getTime() + day * 84),
      actual_farrowed_date: null,
      litter_male_count: 0,
      litter_female_count: 0,
      litter_deceased_count: 0,
      weaened_litter_male_count: 0,
      weaened_litter_female_count: 0,
      weaened_litter_deceased_count: 0,
      remarks: new Date(today.getTime() - day * 29),
    },
    {
      raise_id: raiseB._id,
      boar_name: 'Titan',
      boar_no: 12,
      boar_breed: 'Duroc',
      boar_owner: 'In-house',
      breed_date: new Date(today.getTime() - day * 45),
      estimated_farrowed_date: new Date(today.getTime() + day * 70),
      actual_farrowed_date: null,
      litter_male_count: 0,
      litter_female_count: 0,
      litter_deceased_count: 0,
      weaened_litter_male_count: 0,
      weaened_litter_female_count: 0,
      weaened_litter_deceased_count: 0,
      remarks: new Date(today.getTime() - day * 40),
    },
  ]);

  await FeedingGuide.create([
    {
      raise_id: raiseA._id,
      feeding_period: 'Grower Week 1',
      from_date: new Date(today.getTime() - day * 7),
      to_date: new Date(today.getTime() - day * 1),
      feed_type: 'pellet',
      feed_name: 'Grower Mix A',
      grams: 1600,
    },
    {
      raise_id: raiseA._id,
      feeding_period: 'Grower Week 2',
      from_date: new Date(today.getTime()),
      to_date: new Date(today.getTime() + day * 6),
      feed_type: 'pellet',
      feed_name: 'Grower Mix B',
      grams: 1750,
    },
    {
      raise_id: raiseB._id,
      feeding_period: 'Sow Maintenance',
      from_date: new Date(today.getTime() - day * 3),
      to_date: new Date(today.getTime() + day * 4),
      feed_type: 'mash',
      feed_name: 'Sow Premium',
      grams: 2100,
    },
  ]);

  await FeedInventory.create([
    {
      user_id: ownerId,
      item_name: 'Grower Pellets',
      unit: 'kg',
      quantity: 220,
      reorder_level: 120,
      cost_per_unit: 35,
      supplier: 'AgriFeed Co.',
      notes: 'Main daily feed',
    },
    {
      user_id: ownerId,
      item_name: 'Sow Mash',
      unit: 'kg',
      quantity: 80,
      reorder_level: 100,
      cost_per_unit: 33,
      supplier: 'FarmGrain Inc.',
      notes: 'Below reorder level for alert testing',
    },
    {
      user_id: ownerId,
      item_name: 'Vitamin Premix',
      unit: 'pack',
      quantity: 18,
      reorder_level: 10,
      cost_per_unit: 290,
      supplier: 'VetPlus',
      notes: 'Weekly supplementation',
    },
  ]);

  await Reminder.create([
    {
      user_id: ownerId,
      title: 'Buy Sow Mash',
      description: 'Stock is below reorder level.',
      category: 'inventory',
      due_date: new Date(today.getTime() + day * 1),
      status: 'pending',
    },
    {
      user_id: ownerId,
      title: 'Schedule vaccination',
      description: 'Coordinate with local vet.',
      category: 'health',
      due_date: new Date(today.getTime() + day * 3),
      status: 'pending',
    },
    {
      user_id: ownerId,
      title: 'Update monthly accounting',
      description: 'Close previous month records.',
      category: 'finance',
      due_date: new Date(today.getTime() - day * 2),
      status: 'done',
    },
  ]);
}

async function run() {
  if (!DB_URL) {
    throw new Error('DB_URL is missing in environment.');
  }

  await mongoose.connect(DB_URL);

  try {
    const users = await upsertDemoUsers();
    const owner = users.find((user) => user.role === 'owner');

    if (!owner?._id) {
      throw new Error('Owner user could not be created.');
    }

    await clearOwnerData(owner._id);
    await seedOwnerDomainData(owner._id);

    const [raiseCount, livestockCount, eventCount, noteCount, accountingCount, sowHistoryCount, feedingGuideCount, feedInventoryCount, reminderCount] = await Promise.all([
      Raise.countDocuments({ user: owner._id }),
      Livestock.countDocuments(),
      Event.countDocuments(),
      Note.countDocuments(),
      Accounting.countDocuments(),
      SowHistory.countDocuments(),
      FeedingGuide.countDocuments(),
      FeedInventory.countDocuments({ user_id: owner._id }),
      Reminder.countDocuments({ user_id: owner._id }),
    ]);

    console.log('Dummy data seeded successfully.');
    console.log(`Owner login: demo.owner@piggery.local / Passw0rd!`);
    console.log(`Manager login: demo.manager@piggery.local / Passw0rd!`);
    console.log(`Staff login: demo.staff@piggery.local / Passw0rd!`);
    console.log('Seed summary:');
    console.log({
      raises: raiseCount,
      livestock: livestockCount,
      events: eventCount,
      notes: noteCount,
      accounting: accountingCount,
      sowHistory: sowHistoryCount,
      feedingGuides: feedingGuideCount,
      feedInventory: feedInventoryCount,
      reminders: reminderCount,
    });
  } finally {
    await mongoose.disconnect();
  }
}

run().catch((error) => {
  console.error('Failed to seed dummy data:', error.message);
  process.exit(1);
});
