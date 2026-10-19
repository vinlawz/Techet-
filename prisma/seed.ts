import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const organizerUser = await prisma.user.upsert({
    where: { email: "organizer@techet.africa" },
    update: {},
    create: {
      name: "Techet Collective",
      email: "organizer@techet.africa",
      passwordHash,
      role: "ORGANIZER",
      organizer: {
        create: {
          displayName: "Techet Collective",
          bio: "Independent promoters putting on the best nights and days in Nairobi.",
        },
      },
    },
    include: { organizer: true },
  });

  const organizerId = organizerUser.organizer!.id;

  const ngongRacecourse = await prisma.venue.upsert({
    where: { id: "seed-venue-ngong-racecourse" },
    update: {},
    create: {
      id: "seed-venue-ngong-racecourse",
      name: "Ngong Racecourse",
      address: "Ngong Road",
      city: "Nairobi",
      country: "Kenya",
    },
  });

  const theAlchemist = await prisma.venue.upsert({
    where: { id: "seed-venue-the-alchemist" },
    update: {},
    create: {
      id: "seed-venue-the-alchemist",
      name: "The Alchemist Bar",
      address: "Westlands",
      city: "Nairobi",
      country: "Kenya",
    },
  });

  const sarit = await prisma.venue.upsert({
    where: { id: "seed-venue-sarit-expo" },
    update: {},
    create: {
      id: "seed-venue-sarit-expo",
      name: "Sarit Expo Centre",
      address: "Westlands",
      city: "Nairobi",
      country: "Kenya",
    },
  });

  const events = [
    {
      slug: "sunset-sessions-vol-4",
      title: "Sunset Sessions Vol. 4",
      description:
        "An open-air afternoon into evening of house and afro-fusion DJs overlooking the racecourse, with food trucks and craft drinks on site.",
      category: "Music",
      imageUrl: "/events/sunset-sessions.jpg",
      venueId: ngongRacecourse.id,
      startsAt: new Date("2026-10-24T14:00:00+03:00"),
      endsAt: new Date("2026-10-24T23:00:00+03:00"),
      ticketTypes: [
        { name: "Early Bird", price: 1500, quantity: 150 },
        { name: "Regular", price: 2500, quantity: 400 },
        { name: "VIP", price: 6000, quantity: 60 },
      ],
    },
    {
      slug: "nairobi-tech-summit-2026",
      title: "Nairobi Tech Summit 2026",
      description:
        "A day of talks and workshops on AI, fintech, and startup growth from founders and engineers building across East Africa.",
      category: "Tech",
      imageUrl: "/events/tech-summit.jpg",
      venueId: sarit.id,
      startsAt: new Date("2026-11-07T09:00:00+03:00"),
      endsAt: new Date("2026-11-07T18:00:00+03:00"),
      ticketTypes: [
        { name: "Standard Pass", price: 3000, quantity: 300 },
        { name: "Student Pass", price: 1200, quantity: 100 },
        { name: "All-Access Pass", price: 8000, quantity: 50 },
      ],
    },
    {
      slug: "afro-gallery-night",
      title: "Afro Gallery Night",
      description:
        "A late-night contemporary art showcase featuring emerging Kenyan painters and sculptors, with live jazz between walkthroughs.",
      category: "Art",
      imageUrl: "/events/gallery-night.jpg",
      venueId: theAlchemist.id,
      startsAt: new Date("2026-11-14T18:00:00+03:00"),
      endsAt: new Date("2026-11-15T00:00:00+03:00"),
      ticketTypes: [
        { name: "Entry", price: 1000, quantity: 200 },
        { name: "Collector's Pass", price: 4000, quantity: 25 },
      ],
    },
    {
      slug: "nairobi-street-food-festival",
      title: "Nairobi Street Food Festival",
      description:
        "Over 40 vendors serving Kenyan and pan-African street food, with cooking demos and a kids' zone running all weekend.",
      category: "Food",
      imageUrl: "/events/food-festival.jpg",
      venueId: ngongRacecourse.id,
      startsAt: new Date("2026-12-05T11:00:00+03:00"),
      endsAt: new Date("2026-12-06T21:00:00+03:00"),
      ticketTypes: [
        { name: "Day Pass", price: 800, quantity: 500 },
        { name: "Weekend Pass", price: 1400, quantity: 200 },
      ],
    },
    {
      slug: "sunrise-yoga-wellness-retreat",
      title: "Sunrise Yoga & Wellness Retreat",
      description:
        "A half-day of guided yoga, breathwork, and sound healing led by local instructors, followed by a plant-based brunch.",
      category: "Wellness",
      imageUrl: "/events/yoga-retreat.jpg",
      venueId: theAlchemist.id,
      startsAt: new Date("2026-12-20T06:30:00+03:00"),
      endsAt: new Date("2026-12-20T11:00:00+03:00"),
      ticketTypes: [
        { name: "General", price: 1800, quantity: 80 },
        { name: "With Brunch", price: 2800, quantity: 60 },
      ],
    },
  ];

  for (const e of events) {
    await prisma.event.upsert({
      where: { slug: e.slug },
      update: { imageUrl: e.imageUrl },
      create: {
        organizerId,
        venueId: e.venueId,
        title: e.title,
        slug: e.slug,
        description: e.description,
        category: e.category,
        imageUrl: e.imageUrl,
        startsAt: e.startsAt,
        endsAt: e.endsAt,
        status: "PUBLISHED",
        ticketTypes: { create: e.ticketTypes },
      },
    });
  }

  console.log(`Seeded ${events.length} events for organizer ${organizerUser.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
