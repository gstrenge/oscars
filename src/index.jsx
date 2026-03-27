import { useState, useEffect, useCallback, useRef, useMemo } from "react";

// ─── DATA LAYER ─────────────────────────────────────────────────────────────
// In production, these would be separate JSON files fetched per-route.
// For the prototype, we inline placeholder data.

const SITE_TITLE = "Cali's Oscars";

const CEREMONY_DATA = {
  2025: {
    year: 2025,
    ordinal: "1st",
    date: "March 1, 2025",
    bio: "The inaugural Cali's Oscars brought together friends and film lovers for a night of cinematic celebration. Guests arrived dressed as their favorite characters from the year's most acclaimed films — from the sweeping deserts of Dune to the gritty streets of The Brutalist. An unforgettable evening of costumes, laughter, and love for the movies.",
    attendees: [
      { name: "Garrit Strenge", slug: "garrit-strenge", character: "Paul Atreides", movie: "Dune: Part Two", images: ["1709300000_jsmith_thumb.jpg", "1709300100_jsmith_thumb.jpg", "1709300200_alee_thumb.jpg"] },
      { name: "Maya Chen", slug: "maya-chen", character: "Zora Neale", movie: "The Brutalist", images: ["1709300300_bwong_thumb.jpg", "1709300400_bwong_thumb.jpg"] },
      { name: "Leo Alvarez", slug: "leo-alvarez", character: "Emilia Pérez", movie: "Emilia Pérez", images: ["1709300500_cpark_thumb.jpg", "1709300600_cpark_thumb.jpg", "1709300700_jsmith_thumb.jpg"] },
      { name: "Priya Nair", slug: "priya-nair", character: "Elphaba", movie: "Wicked", images: ["1709300800_alee_thumb.jpg", "1709300900_alee_thumb.jpg"] },
      { name: "Jordan Kim", slug: "jordan-kim", character: "Anora", movie: "Anora", images: ["1709301000_dchen_thumb.jpg", "1709301100_dchen_thumb.jpg", "1709301200_jsmith_thumb.jpg"] },
      { name: "Sam Rivera", slug: "sam-rivera", character: "Marcello", movie: "Conclave", images: ["1709301300_bwong_thumb.jpg"] },
      { name: "Ava Okonkwo", slug: "ava-okonkwo", character: "Fernanda Torres", movie: "I'm Still Here", images: ["1709301400_cpark_thumb.jpg", "1709301500_cpark_thumb.jpg"] },
    ],
    movies: [
      { title: "Dune: Part Two", director: "Denis Villeneuve", imdb: "https://imdb.com/title/tt15239678" },
      { title: "The Brutalist", director: "Brady Corbet", imdb: "https://imdb.com/title/tt16277242" },
      { title: "Emilia Pérez", director: "Jacques Audiard", imdb: "https://imdb.com/title/tt20221436" },
      { title: "Wicked", director: "Jon M. Chu", imdb: "https://imdb.com/title/tt1262426" },
      { title: "Anora", director: "Sean Baker", imdb: "https://imdb.com/title/tt28607951" },
      { title: "Conclave", director: "Edward Berger", imdb: "https://imdb.com/title/tt20215234" },
      { title: "I'm Still Here", director: "Walter Salles", imdb: "https://imdb.com/title/tt14961016" },
    ],
  },
  2026: {
    year: 2026,
    ordinal: "2nd",
    date: "March 15, 2026",
    bio: "The second annual Cali's Oscars raised the bar with elaborate costumes and an expanded guest list. This year's theme drew from blockbusters and indie darlings alike — animated favorites rubbed shoulders with dramatic powerhouses. The venue was transformed into a garden courtyard inspired by the actual 98th Academy Awards stage design.",
    "attendees": [
    {
      "name": "Abby Langan",
      "slug": "abby-langan",
      "character": "Agnes",
      "movie": "Hamnet",
      "images": [
        "20260315_182256_Garrit_Strenge.webp",
        "20260315_182256_Garrit_Strenge_1.webp",
        "20260315_182257_Garrit_Strenge.webp",
        "20260315_182258_Garrit_Strenge.webp",
        "20260315_182300_Garrit_Strenge.webp",
        "20260315_182302_Garrit_Strenge.webp",
        "20260315_182303_Garrit_Strenge.webp",
        "20260315_182313_Garrit_Strenge.webp",
        "20260315_182313_Garrit_Strenge_1.webp",
        "20260315_182314_Garrit_Strenge.webp",
        "20260315_181703_Kyle_Wheeler.webp",
        "20260315_181702_Kyle_Wheeler.webp",
        "20260315_182255_Kyle_Wheeler.webp",
        "20260315_182255_Kyle_Wheeler_1.webp",
        "20260315_182255_Kyle_Wheeler_2.webp",
        "20260315_182256_Kyle_Wheeler.webp",
        "20260315_182257_Kyle_Wheeler.webp",
        "20260315_182257_Kyle_Wheeler_1.webp",
        "20260315_182258_Kyle_Wheeler.webp",
        "20260315_182300_Kyle_Wheeler.webp",
        "20260315_182302_Kyle_Wheeler.webp",
        "20260315_182303_Kyle_Wheeler.webp",
        "20260315_182304_Kyle_Wheeler.webp",
        "20260315_182305_Kyle_Wheeler.webp",
        "20260315_182307_Kyle_Wheeler.webp",
        "20260315_182308_Kyle_Wheeler.webp",
        "20260315_182309_Kyle_Wheeler.webp",
        "20260315_182310_Kyle_Wheeler.webp",
        "20260315_182312_Kyle_Wheeler.webp",
        "20260315_182313_Kyle_Wheeler.webp",
        "20260315_182315_Kyle_Wheeler.webp",
        "20260315_182316_Kyle_Wheeler.webp",
        "20260315_182555_Kyle_Wheeler.webp"
      ]
    },
    {
      "name": "Amelia Langan",
      "slug": "amelia-langan",
      "character": "Final-Form Alien Michelle",
      "movie": "Bugonia",
      "images": [
        "20260315_200828_Garrit_Strenge.webp",
        "20260315_200830_Garrit_Strenge.webp",
        "20260315_200831_Garrit_Strenge.webp",
        "20260315_200834_Garrit_Strenge.webp",
        "20260315_200835_Garrit_Strenge.webp",
        "20260315_200840_Garrit_Strenge.webp",
        "20260315_200842_Garrit_Strenge.webp",
        "20260315_200843_Garrit_Strenge.webp",
        "20260315_200844_Garrit_Strenge.webp",
        "20260315_200845_Garrit_Strenge.webp",
        "20260315_200845_Garrit_Strenge_1.webp",
        "20260315_200846_Garrit_Strenge.webp",
        "20260315_200846_Garrit_Strenge_1.webp",
        "20260315_200847_Garrit_Strenge.webp",
        "20260315_221155_Garrit_Strenge.webp",
        "20260315_221155_Garrit_Strenge_1.webp"
      ]
    },
    {
      "name": "Ben Thacher",
      "slug": "ben-thacher",
      "character": "Olga The Cat",
      "movie": "Sorry, Baby",
      "images": [
        "20260315_181827_Garrit_Strenge.webp",
        "20260315_181828_Garrit_Strenge.webp",
        "20260315_181832_Garrit_Strenge.webp",
        "20260315_181841_Garrit_Strenge.webp",
        "20260315_181841_Garrit_Strenge_1.webp",
        "20260315_181842_Garrit_Strenge.webp",
        "20260315_182554_Garrit_Strenge.webp",
        "20260315_182601_Garrit_Strenge.webp",
        "20260315_181818_Kyle_Wheeler.webp",
        "20260315_181823_Kyle_Wheeler.webp",
        "20260315_181824_Kyle_Wheeler.webp",
        "20260315_181837_Kyle_Wheeler.webp",
        "20260315_181839_Kyle_Wheeler.webp",
        "20260315_182453_Kyle_Wheeler.webp",
        "20260315_182458_Kyle_Wheeler.webp",
        "20260315_182605_Kyle_Wheeler.webp"
      ]
    },
    {
      "name": "Bradley Bares",
      "slug": "bradley-bares",
      "character": "Marty Mauser",
      "movie": "Marty Supreme",
      "images": [
        "20260315_200730_Garrit_Strenge.webp",
        "20260315_200730_Garrit_Strenge_1.webp",
        "20260315_200731_Garrit_Strenge.webp",
        "20260315_200732_Garrit_Strenge.webp",
        "20260315_200732_Garrit_Strenge_1.webp",
        "20260315_200732_Garrit_Strenge_2.webp",
        "20260315_200733_Garrit_Strenge.webp",
        "20260315_200735_Garrit_Strenge.webp",
        "20260315_200749_Garrit_Strenge.webp",
        "20260315_200750_Garrit_Strenge.webp",
        "20260315_200752_Garrit_Strenge.webp",
        "20260315_200828_Garrit_Strenge.webp",
        "20260315_200830_Garrit_Strenge.webp",
        "20260315_200831_Garrit_Strenge.webp",
        "20260315_200834_Garrit_Strenge.webp",
        "20260315_200835_Garrit_Strenge.webp",
        "20260315_200840_Garrit_Strenge.webp",
        "20260315_200842_Garrit_Strenge.webp",
        "20260315_200843_Garrit_Strenge.webp",
        "20260315_200844_Garrit_Strenge.webp",
        "20260315_200845_Garrit_Strenge.webp",
        "20260315_200845_Garrit_Strenge_1.webp",
        "20260315_200846_Garrit_Strenge.webp",
        "20260315_200846_Garrit_Strenge_1.webp",
        "20260315_200847_Garrit_Strenge.webp"
      ]
    },
    {
      "name": "Cali McCoy",
      "slug": "cali-mccoy",
      "character": "Dr. Kelson",
      "movie": "28 Years Later",
      "images": [
        "20260315_181923_Garrit_Strenge.webp",
        "20260315_181927_Garrit_Strenge.webp",
        "20260315_181928_Garrit_Strenge.webp",
        "20260315_181930_Garrit_Strenge.webp",
        "20260315_181947_Garrit_Strenge.webp",
        "20260315_181949_Garrit_Strenge.webp",
        "20260315_181955_Garrit_Strenge.webp",
        "20260315_181957_Garrit_Strenge.webp",
        "20260315_181958_Garrit_Strenge.webp",
        "20260315_221026_Garrit_Strenge.webp",
        "20260315_221030_Garrit_Strenge.webp",
        "20260315_221040_Garrit_Strenge.webp",
        "20260315_221042_Garrit_Strenge.webp",
        "20260315_221115_Garrit_Strenge.webp",
        "20260315_221138_Garrit_Strenge.webp",
        "20260315_221139_Garrit_Strenge.webp",
        "20260315_221140_Garrit_Strenge.webp",
        "20260315_221141_Garrit_Strenge.webp",
        "20260315_221141_Garrit_Strenge_1.webp",
        "20260315_221154_Garrit_Strenge.webp",
        "20260315_221155_Garrit_Strenge.webp",
        "20260315_221155_Garrit_Strenge_1.webp",
        "20260315_221156_Garrit_Strenge.webp",
        "20260315_221203_Garrit_Strenge.webp",
        "20260315_221205_Garrit_Strenge.webp",
        "20260315_221206_Garrit_Strenge.webp",
        "20260315_221207_Garrit_Strenge.webp",
        "20260315_221208_Garrit_Strenge.webp",
        "20260315_221208_Garrit_Strenge_1.webp",
        "20260315_181926_Kyle_Wheeler.webp",
        "20260315_181927_Kyle_Wheeler.webp",
        "20260315_181947_Kyle_Wheeler.webp",
        "20260315_181950_Kyle_Wheeler.webp",
        "20260315_182555_Kyle_Wheeler.webp",
        "20260315_221607_Kyle_Wheeler.webp",
        "20260315_221608_Kyle_Wheeler.webp",
        "20260315_221612_Kyle_Wheeler.webp",
        "20260315_221613_Kyle_Wheeler.webp",
        "20260315_221615_Kyle_Wheeler.webp",
        "20260315_221616_Kyle_Wheeler.webp",
        "20260315_221617_Kyle_Wheeler.webp",
        "20260315_221724_Kyle_Wheeler.webp",
        "20260315_221726_Kyle_Wheeler.webp",
        "20260315_221728_Kyle_Wheeler.webp",
        "20260315_221730_Kyle_Wheeler.webp",
        "20260315_221732_Kyle_Wheeler.webp",
        "20260315_221735_Kyle_Wheeler.webp",
        "20260315_221736_Kyle_Wheeler.webp",
        "20260315_221749_Kyle_Wheeler.webp",
        "20260315_221751_Kyle_Wheeler.webp",
        "20260315_221755_Kyle_Wheeler.webp",
        "20260315_221758_Kyle_Wheeler.webp",
        "20260315_222757_Kyle_Wheeler.webp",
        "20260315_222759_Kyle_Wheeler.webp",
        "20260315_222800_Kyle_Wheeler.webp",
        "20260315_222801_Kyle_Wheeler.webp",
        "20260315_222804_Kyle_Wheeler.webp",
        "20260315_222806_Kyle_Wheeler.webp",
        "20260315_222822_Kyle_Wheeler.webp",
        "20260315_222824_Kyle_Wheeler.webp",
        "20260315_222825_Kyle_Wheeler.webp",
        "20260315_222835_Kyle_Wheeler.webp",
        "20260315_222837_Kyle_Wheeler.webp",
        "20260315_222839_Kyle_Wheeler.webp"
      ]
    },
    {
      "name": "Erik Zilber",
      "slug": "erik-zilber",
      "character": "Sir Lord Jimmy Crystal",
      "movie": "28 Years Later",
      "images": [
        "20260315_181630_Garrit_Strenge.webp",
        "20260315_181904_Garrit_Strenge.webp",
        "20260315_181906_Garrit_Strenge.webp",
        "20260315_181911_Garrit_Strenge.webp",
        "20260315_181912_Garrit_Strenge.webp",
        "20260315_181914_Garrit_Strenge.webp",
        "20260315_181916_Garrit_Strenge.webp",
        "20260315_181923_Garrit_Strenge.webp",
        "20260315_181927_Garrit_Strenge.webp",
        "20260315_181928_Garrit_Strenge.webp",
        "20260315_181930_Garrit_Strenge.webp",
        "20260315_181947_Garrit_Strenge.webp",
        "20260315_181949_Garrit_Strenge.webp",
        "20260315_181955_Garrit_Strenge.webp",
        "20260315_181957_Garrit_Strenge.webp",
        "20260315_181958_Garrit_Strenge.webp",
        "20260315_221026_Garrit_Strenge.webp",
        "20260315_221030_Garrit_Strenge.webp",
        "20260315_221031_Garrit_Strenge.webp",
        "20260315_170845_Kyle_Wheeler.webp",
        "20260315_170846_Kyle_Wheeler.webp",
        "20260315_170852_Kyle_Wheeler.webp",
        "20260315_170853_Kyle_Wheeler.webp",
        "20260315_181641_Kyle_Wheeler.webp",
        "20260315_181858_Kyle_Wheeler.webp",
        "20260315_181900_Kyle_Wheeler.webp",
        "20260315_181910_Kyle_Wheeler.webp",
        "20260315_181912_Kyle_Wheeler.webp",
        "20260315_181926_Kyle_Wheeler.webp",
        "20260315_181927_Kyle_Wheeler.webp",
        "20260315_181947_Kyle_Wheeler.webp",
        "20260315_181950_Kyle_Wheeler.webp",
        "20260315_182553_Kyle_Wheeler.webp",
        "20260315_221131_Kyle_Wheeler.webp",
        "20260315_221337_Kyle_Wheeler.webp"
      ]
    },
    {
      "name": "Garrit Strenge",
      "slug": "garrit-strenge",
      "character": "Nick Wilde",
      "movie": "Zootopia 2",
      "images": [
        "20260315_182426_Garrit_Strenge.webp",
        "20260315_182428_Garrit_Strenge.webp",
        "20260315_182431_Garrit_Strenge.webp",
        "20260315_182433_Garrit_Strenge.webp",
        "20260315_182435_Garrit_Strenge.webp",
        "20260315_182436_Garrit_Strenge.webp",
        "20260315_182441_Garrit_Strenge.webp",
        "20260315_221051_Garrit_Strenge.webp",
        "20260315_181411_Kyle_Wheeler.webp",
        "20260315_181411_Kyle_Wheeler_1.webp",
        "20260315_181412_Kyle_Wheeler.webp",
        "20260315_181622_Kyle_Wheeler.webp",
        "20260315_182357_Kyle_Wheeler.webp",
        "20260315_182358_Kyle_Wheeler.webp",
        "20260315_182359_Kyle_Wheeler.webp",
        "20260315_182401_Kyle_Wheeler.webp",
        "20260315_182402_Kyle_Wheeler.webp",
        "20260315_182403_Kyle_Wheeler.webp",
        "20260315_182404_Kyle_Wheeler.webp",
        "20260315_182406_Kyle_Wheeler.webp",
        "20260315_182415_Kyle_Wheeler.webp",
        "20260315_182416_Kyle_Wheeler.webp",
        "20260315_182416_Kyle_Wheeler_1.webp",
        "20260315_182416_Kyle_Wheeler_2.webp",
        "20260315_182417_Kyle_Wheeler.webp",
        "20260315_182417_Kyle_Wheeler_1.webp",
        "20260315_182417_Kyle_Wheeler_2.webp",
        "20260315_182418_Kyle_Wheeler.webp",
        "20260315_182418_Kyle_Wheeler_1.webp",
        "20260315_182419_Kyle_Wheeler.webp",
        "20260315_182421_Kyle_Wheeler.webp",
        "20260315_182422_Kyle_Wheeler.webp",
        "20260315_182437_Kyle_Wheeler.webp",
        "20260315_182438_Kyle_Wheeler.webp",
        "20260315_182439_Kyle_Wheeler.webp",
        "20260315_182439_Kyle_Wheeler_1.webp",
        "20260315_182440_Kyle_Wheeler.webp",
        "20260315_182441_Kyle_Wheeler.webp",
        "20260315_182441_Kyle_Wheeler_1.webp",
        "20260315_182442_Kyle_Wheeler.webp",
        "20260315_182442_Kyle_Wheeler_1.webp",
        "20260315_182525_Kyle_Wheeler.webp"
      ]
    },
    {
      "name": "Grace Miller",
      "slug": "grace-miller",
      "character": "Rumi",
      "movie": "Kpop Demon Hunters",
      "images": [
        "20260315_181720_Garrit_Strenge.webp",
        "20260315_181722_Garrit_Strenge.webp",
        "20260315_181723_Garrit_Strenge.webp",
        "20260315_181751_Garrit_Strenge.webp",
        "20260315_181752_Garrit_Strenge.webp",
        "20260315_181755_Garrit_Strenge.webp",
        "20260315_181759_Garrit_Strenge.webp",
        "20260315_181804_Garrit_Strenge.webp",
        "20260315_182601_Garrit_Strenge.webp",
        "20260315_221044_Garrit_Strenge.webp",
        "20260315_181715_Kyle_Wheeler.webp",
        "20260315_181716_Kyle_Wheeler.webp",
        "20260315_181718_Kyle_Wheeler.webp",
        "20260315_181719_Kyle_Wheeler.webp",
        "20260315_181720_Kyle_Wheeler.webp",
        "20260315_181746_Kyle_Wheeler.webp",
        "20260315_181756_Kyle_Wheeler.webp",
        "20260315_181757_Kyle_Wheeler.webp",
        "20260315_221534_Kyle_Wheeler.webp",
        "20260315_221536_Kyle_Wheeler.webp",
        "20260315_221607_Kyle_Wheeler.webp",
        "20260315_221608_Kyle_Wheeler.webp",
        "20260315_221612_Kyle_Wheeler.webp",
        "20260315_221613_Kyle_Wheeler.webp",
        "20260315_221615_Kyle_Wheeler.webp",
        "20260315_221616_Kyle_Wheeler.webp",
        "20260315_221617_Kyle_Wheeler.webp"
      ]
    },
    {
      "name": "Grace O'Dwyer",
      "slug": "grace-o-dwyer",
      "character": "Bald Michelle",
      "movie": "Bugonia",
      "images": [
        "20260315_181611_Garrit_Strenge.webp",
        "20260315_181613_Garrit_Strenge.webp",
        "20260315_181617_Garrit_Strenge.webp",
        "20260315_221115_Garrit_Strenge.webp",
        "20260315_221138_Garrit_Strenge.webp",
        "20260315_221139_Garrit_Strenge.webp",
        "20260315_221140_Garrit_Strenge.webp",
        "20260315_221141_Garrit_Strenge.webp",
        "20260315_221141_Garrit_Strenge_1.webp",
        "20260315_221154_Garrit_Strenge.webp",
        "20260315_221155_Garrit_Strenge.webp",
        "20260315_221155_Garrit_Strenge_1.webp",
        "20260315_221156_Garrit_Strenge.webp",
        "20260315_221203_Garrit_Strenge.webp",
        "20260315_221205_Garrit_Strenge.webp",
        "20260315_221206_Garrit_Strenge.webp",
        "20260315_221207_Garrit_Strenge.webp",
        "20260315_221208_Garrit_Strenge.webp",
        "20260315_221208_Garrit_Strenge_1.webp",
        "20260315_181535_Kyle_Wheeler.webp",
        "20260315_181537_Kyle_Wheeler.webp",
        "20260315_181539_Kyle_Wheeler.webp",
        "20260315_181558_Kyle_Wheeler.webp",
        "20260315_181558_Kyle_Wheeler_1.webp",
        "20260315_181558_Kyle_Wheeler_2.webp",
        "20260315_181559_Kyle_Wheeler.webp",
        "20260315_181559_Kyle_Wheeler_1.webp",
        "20260315_181600_Kyle_Wheeler.webp",
        "20260315_181600_Kyle_Wheeler_1.webp",
        "20260315_181601_Kyle_Wheeler.webp",
        "20260315_181601_Kyle_Wheeler_1.webp",
        "20260315_181601_Kyle_Wheeler_2.webp",
        "20260315_181604_Kyle_Wheeler.webp",
        "20260315_181605_Kyle_Wheeler.webp",
        "20260315_181605_Kyle_Wheeler_1.webp",
        "20260315_181605_Kyle_Wheeler_2.webp",
        "20260315_181606_Kyle_Wheeler.webp",
        "20260315_181606_Kyle_Wheeler_1.webp",
        "20260315_181609_Kyle_Wheeler.webp",
        "20260315_181610_Kyle_Wheeler.webp",
        "20260315_181611_Kyle_Wheeler.webp",
        "20260315_181612_Kyle_Wheeler.webp"
      ]
    },
    {
      "name": "Gracie Rosenbaum",
      "slug": "gracie-rosenbaum",
      "character": "Agnes",
      "movie": "Sorry, Baby",
      "images": [
        "20260315_181827_Garrit_Strenge.webp",
        "20260315_181828_Garrit_Strenge.webp",
        "20260315_181832_Garrit_Strenge.webp",
        "20260315_181841_Garrit_Strenge.webp",
        "20260315_181841_Garrit_Strenge_1.webp",
        "20260315_181842_Garrit_Strenge.webp",
        "20260315_182554_Garrit_Strenge.webp",
        "20260315_182601_Garrit_Strenge.webp",
        "20260315_181818_Kyle_Wheeler.webp",
        "20260315_181823_Kyle_Wheeler.webp",
        "20260315_181824_Kyle_Wheeler.webp",
        "20260315_181837_Kyle_Wheeler.webp",
        "20260315_181839_Kyle_Wheeler.webp",
        "20260315_182453_Kyle_Wheeler.webp",
        "20260315_182458_Kyle_Wheeler.webp",
        "20260315_182605_Kyle_Wheeler.webp"
      ]
    },
    {
      "name": "Griffin Prushinski",
      "slug": "griffin-prushinski",
      "character": "William Shakespeare",
      "movie": "Hamnet",
      "images": [
        "20260315_182256_Garrit_Strenge.webp",
        "20260315_182256_Garrit_Strenge_1.webp",
        "20260315_182257_Garrit_Strenge.webp",
        "20260315_182258_Garrit_Strenge.webp",
        "20260315_182300_Garrit_Strenge.webp",
        "20260315_182302_Garrit_Strenge.webp",
        "20260315_182303_Garrit_Strenge.webp",
        "20260315_182313_Garrit_Strenge.webp",
        "20260315_182313_Garrit_Strenge_1.webp",
        "20260315_182314_Garrit_Strenge.webp",
        "20260315_181703_Kyle_Wheeler.webp",
        "20260315_181702_Kyle_Wheeler.webp",
        "20260315_182255_Kyle_Wheeler.webp",
        "20260315_182255_Kyle_Wheeler_1.webp",
        "20260315_182255_Kyle_Wheeler_2.webp",
        "20260315_182256_Kyle_Wheeler.webp",
        "20260315_182257_Kyle_Wheeler.webp",
        "20260315_182257_Kyle_Wheeler_1.webp",
        "20260315_182258_Kyle_Wheeler.webp",
        "20260315_182300_Kyle_Wheeler.webp",
        "20260315_182302_Kyle_Wheeler.webp",
        "20260315_182303_Kyle_Wheeler.webp",
        "20260315_182304_Kyle_Wheeler.webp",
        "20260315_182305_Kyle_Wheeler.webp",
        "20260315_182307_Kyle_Wheeler.webp",
        "20260315_182308_Kyle_Wheeler.webp",
        "20260315_182309_Kyle_Wheeler.webp",
        "20260315_182310_Kyle_Wheeler.webp",
        "20260315_182312_Kyle_Wheeler.webp",
        "20260315_182313_Kyle_Wheeler.webp",
        "20260315_182315_Kyle_Wheeler.webp",
        "20260315_182316_Kyle_Wheeler.webp"
      ]
    },
    {
      "name": "Jared Cohen",
      "slug": "jared-cohen",
      "character": "Jinu",
      "movie": "Kpop Demon Hunters",
      "images": [
        "20260315_181730_Garrit_Strenge.webp",
        "20260315_181732_Garrit_Strenge.webp",
        "20260315_181735_Garrit_Strenge.webp",
        "20260315_181736_Garrit_Strenge.webp",
        "20260315_181739_Garrit_Strenge.webp",
        "20260315_181743_Garrit_Strenge.webp",
        "20260315_181751_Garrit_Strenge.webp",
        "20260315_181752_Garrit_Strenge.webp",
        "20260315_181755_Garrit_Strenge.webp",
        "20260315_181759_Garrit_Strenge.webp",
        "20260315_181804_Garrit_Strenge.webp",
        "20260315_221044_Garrit_Strenge.webp",
        "20260315_181411_Kyle_Wheeler.webp",
        "20260315_181411_Kyle_Wheeler_1.webp",
        "20260315_181622_Kyle_Wheeler.webp",
        "20260315_181725_Kyle_Wheeler.webp",
        "20260315_181726_Kyle_Wheeler.webp",
        "20260315_181727_Kyle_Wheeler.webp",
        "20260315_181729_Kyle_Wheeler.webp",
        "20260315_181742_Kyle_Wheeler.webp",
        "20260315_181746_Kyle_Wheeler.webp",
        "20260315_181756_Kyle_Wheeler.webp",
        "20260315_181757_Kyle_Wheeler.webp",
        "20260315_221534_Kyle_Wheeler.webp",
        "20260315_221536_Kyle_Wheeler.webp",
        "20260315_221607_Kyle_Wheeler.webp",
        "20260315_221608_Kyle_Wheeler.webp",
        "20260315_221612_Kyle_Wheeler.webp",
        "20260315_221613_Kyle_Wheeler.webp",
        "20260315_221615_Kyle_Wheeler.webp",
        "20260315_221616_Kyle_Wheeler.webp",
        "20260315_221617_Kyle_Wheeler.webp"
      ]
    },
    {
      "name": "Kathryn Jemas",
      "slug": "kathryn-jemas",
      "character": "Rachel Mizler",
      "movie": "Marty Supreme",
      "images": [
        "20260315_181415_Garrit_Strenge.webp",
        "20260315_182134_Garrit_Strenge.webp",
        "20260315_182136_Garrit_Strenge.webp",
        "20260315_182138_Garrit_Strenge.webp",
        "20260315_182139_Garrit_Strenge.webp",
        "20260315_182140_Garrit_Strenge.webp",
        "20260315_182143_Garrit_Strenge.webp",
        "20260315_182145_Garrit_Strenge.webp",
        "20260315_182148_Garrit_Strenge.webp",
        "20260315_182150_Garrit_Strenge.webp",
        "20260315_182152_Garrit_Strenge.webp",
        "20260315_182153_Garrit_Strenge.webp",
        "20260315_182155_Garrit_Strenge.webp",
        "20260315_182156_Garrit_Strenge.webp",
        "20260315_181530_Kyle_Wheeler.webp",
        "20260315_181531_Kyle_Wheeler.webp",
        "20260315_182137_Kyle_Wheeler.webp",
        "20260315_182137_Kyle_Wheeler_1.webp",
        "20260315_182139_Kyle_Wheeler.webp",
        "20260315_182139_Kyle_Wheeler_1.webp",
        "20260315_182139_Kyle_Wheeler_2.webp",
        "20260315_182140_Kyle_Wheeler.webp",
        "20260315_182140_Kyle_Wheeler_1.webp",
        "20260315_182141_Kyle_Wheeler.webp",
        "20260315_182142_Kyle_Wheeler.webp",
        "20260315_182142_Kyle_Wheeler_1.webp",
        "20260315_182143_Kyle_Wheeler.webp",
        "20260315_182144_Kyle_Wheeler.webp",
        "20260315_182144_Kyle_Wheeler_1.webp",
        "20260315_182145_Kyle_Wheeler.webp",
        "20260315_182145_Kyle_Wheeler_1.webp",
        "20260315_182146_Kyle_Wheeler.webp",
        "20260315_182146_Kyle_Wheeler_1.webp",
        "20260315_182147_Kyle_Wheeler.webp",
        "20260315_182148_Kyle_Wheeler.webp",
        "20260315_182148_Kyle_Wheeler_1.webp",
        "20260315_182149_Kyle_Wheeler.webp",
        "20260315_182150_Kyle_Wheeler.webp",
        "20260315_182150_Kyle_Wheeler_1.webp",
        "20260315_182151_Kyle_Wheeler.webp",
        "20260315_182151_Kyle_Wheeler_1.webp",
        "20260315_182153_Kyle_Wheeler.webp",
        "20260315_182153_Kyle_Wheeler_1.webp",
        "20260315_182153_Kyle_Wheeler_2.webp",
        "20260315_182155_Kyle_Wheeler.webp",
        "20260315_182155_Kyle_Wheeler_1.webp",
        "20260315_182156_Kyle_Wheeler.webp",
        "20260315_182156_Kyle_Wheeler_1.webp"
      ]
    },
    {
      "name": "Kyle Wheeler",
      "slug": "kyle-wheeler",
      "character": "Marty Mauser",
      "movie": "Marty Supreme",
      "images": [
        "20260315_181415_Garrit_Strenge.webp",
        "20260315_181501_Garrit_Strenge.webp",
        "20260315_182041_Garrit_Strenge.webp",
        "20260315_182042_Garrit_Strenge.webp",
        "20260315_182044_Garrit_Strenge.webp",
        "20260315_182045_Garrit_Strenge.webp",
        "20260315_182046_Garrit_Strenge.webp",
        "20260315_182052_Garrit_Strenge.webp",
        "20260315_182057_Garrit_Strenge.webp",
        "20260315_182058_Garrit_Strenge.webp",
        "20260315_182111_Garrit_Strenge.webp",
        "20260315_182134_Garrit_Strenge.webp",
        "20260315_182136_Garrit_Strenge.webp",
        "20260315_182138_Garrit_Strenge.webp",
        "20260315_182139_Garrit_Strenge.webp",
        "20260315_182140_Garrit_Strenge.webp",
        "20260315_182143_Garrit_Strenge.webp",
        "20260315_182145_Garrit_Strenge.webp",
        "20260315_182148_Garrit_Strenge.webp",
        "20260315_182150_Garrit_Strenge.webp",
        "20260315_182152_Garrit_Strenge.webp",
        "20260315_182153_Garrit_Strenge.webp",
        "20260315_182155_Garrit_Strenge.webp",
        "20260315_182156_Garrit_Strenge.webp",
        "20260315_182220_Garrit_Strenge.webp",
        "20260315_182224_Garrit_Strenge.webp",
        "20260315_182225_Garrit_Strenge.webp",
        "20260315_182227_Garrit_Strenge.webp",
        "20260315_182229_Garrit_Strenge.webp",
        "20260315_182230_Garrit_Strenge.webp",
        "20260315_182533_Garrit_Strenge.webp",
        "20260315_200730_Garrit_Strenge.webp",
        "20260315_200730_Garrit_Strenge_1.webp",
        "20260315_200731_Garrit_Strenge.webp",
        "20260315_200732_Garrit_Strenge.webp",
        "20260315_200732_Garrit_Strenge_1.webp",
        "20260315_200732_Garrit_Strenge_2.webp",
        "20260315_200733_Garrit_Strenge.webp",
        "20260315_200735_Garrit_Strenge.webp",
        "20260315_200749_Garrit_Strenge.webp",
        "20260315_200750_Garrit_Strenge.webp",
        "20260315_200752_Garrit_Strenge.webp",
        "20260315_182040_Kyle_Wheeler.webp",
        "20260315_182040_Kyle_Wheeler_1.webp",
        "20260315_182041_Kyle_Wheeler.webp",
        "20260315_182041_Kyle_Wheeler_1.webp",
        "20260315_182042_Kyle_Wheeler.webp",
        "20260315_182042_Kyle_Wheeler_1.webp",
        "20260315_182043_Kyle_Wheeler.webp",
        "20260315_182043_Kyle_Wheeler_1.webp",
        "20260315_182045_Kyle_Wheeler.webp",
        "20260315_182045_Kyle_Wheeler_1.webp",
        "20260315_182045_Kyle_Wheeler_2.webp",
        "20260315_182049_Kyle_Wheeler.webp",
        "20260315_182050_Kyle_Wheeler.webp",
        "20260315_182050_Kyle_Wheeler_1.webp",
        "20260315_182051_Kyle_Wheeler.webp",
        "20260315_182052_Kyle_Wheeler.webp",
        "20260315_182054_Kyle_Wheeler.webp",
        "20260315_182054_Kyle_Wheeler_1.webp",
        "20260315_182056_Kyle_Wheeler.webp",
        "20260315_182056_Kyle_Wheeler_1.webp",
        "20260315_182057_Kyle_Wheeler.webp",
        "20260315_182058_Kyle_Wheeler.webp",
        "20260315_182058_Kyle_Wheeler_1.webp",
        "20260315_182103_Kyle_Wheeler.webp",
        "20260315_182104_Kyle_Wheeler.webp",
        "20260315_182104_Kyle_Wheeler_1.webp",
        "20260315_182105_Kyle_Wheeler.webp",
        "20260315_182106_Kyle_Wheeler.webp",
        "20260315_182106_Kyle_Wheeler_1.webp",
        "20260315_182110_Kyle_Wheeler.webp",
        "20260315_182111_Kyle_Wheeler.webp",
        "20260315_182111_Kyle_Wheeler_1.webp",
        "20260315_182111_Kyle_Wheeler_2.webp",
        "20260315_182137_Kyle_Wheeler.webp",
        "20260315_182137_Kyle_Wheeler_1.webp",
        "20260315_182139_Kyle_Wheeler.webp",
        "20260315_182139_Kyle_Wheeler_1.webp",
        "20260315_182139_Kyle_Wheeler_2.webp",
        "20260315_182140_Kyle_Wheeler.webp",
        "20260315_182140_Kyle_Wheeler_1.webp",
        "20260315_182141_Kyle_Wheeler.webp",
        "20260315_182142_Kyle_Wheeler.webp",
        "20260315_182142_Kyle_Wheeler_1.webp",
        "20260315_182143_Kyle_Wheeler.webp",
        "20260315_182144_Kyle_Wheeler.webp",
        "20260315_182144_Kyle_Wheeler_1.webp",
        "20260315_182145_Kyle_Wheeler.webp",
        "20260315_182145_Kyle_Wheeler_1.webp",
        "20260315_182146_Kyle_Wheeler.webp",
        "20260315_182146_Kyle_Wheeler_1.webp",
        "20260315_182147_Kyle_Wheeler.webp",
        "20260315_182148_Kyle_Wheeler.webp",
        "20260315_182148_Kyle_Wheeler_1.webp",
        "20260315_182149_Kyle_Wheeler.webp",
        "20260315_182150_Kyle_Wheeler.webp",
        "20260315_182150_Kyle_Wheeler_1.webp",
        "20260315_182151_Kyle_Wheeler.webp",
        "20260315_182151_Kyle_Wheeler_1.webp",
        "20260315_182153_Kyle_Wheeler.webp",
        "20260315_182153_Kyle_Wheeler_1.webp",
        "20260315_182153_Kyle_Wheeler_2.webp",
        "20260315_182155_Kyle_Wheeler.webp",
        "20260315_182155_Kyle_Wheeler_1.webp",
        "20260315_182156_Kyle_Wheeler.webp",
        "20260315_182156_Kyle_Wheeler_1.webp",
        "20260315_182221_Kyle_Wheeler.webp",
        "20260315_182221_Kyle_Wheeler_1.webp",
        "20260315_182222_Kyle_Wheeler.webp",
        "20260315_182223_Kyle_Wheeler.webp",
        "20260315_182223_Kyle_Wheeler_1.webp",
        "20260315_182224_Kyle_Wheeler.webp",
        "20260315_182225_Kyle_Wheeler.webp",
        "20260315_182225_Kyle_Wheeler_1.webp",
        "20260315_182225_Kyle_Wheeler_2.webp",
        "20260315_182225_Kyle_Wheeler_3.webp",
        "20260315_182226_Kyle_Wheeler.webp",
        "20260315_182226_Kyle_Wheeler_1.webp",
        "20260315_182227_Kyle_Wheeler.webp",
        "20260315_182227_Kyle_Wheeler_1.webp",
        "20260315_182228_Kyle_Wheeler.webp",
        "20260315_182229_Kyle_Wheeler.webp",
        "20260315_182229_Kyle_Wheeler_1.webp",
        "20260315_182229_Kyle_Wheeler_2.webp",
        "20260315_182230_Kyle_Wheeler.webp",
        "20260315_182230_Kyle_Wheeler_1.webp",
        "20260315_182231_Kyle_Wheeler.webp",
        "20260315_182231_Kyle_Wheeler_1.webp",
        "20260315_222757_Kyle_Wheeler.webp",
        "20260315_222759_Kyle_Wheeler.webp",
        "20260315_222800_Kyle_Wheeler.webp",
        "20260315_222801_Kyle_Wheeler.webp",
        "20260315_222804_Kyle_Wheeler.webp",
        "20260315_222806_Kyle_Wheeler.webp",
        "20260315_222822_Kyle_Wheeler.webp",
        "20260315_222824_Kyle_Wheeler.webp",
        "20260315_222825_Kyle_Wheeler.webp",
        "20260315_222835_Kyle_Wheeler.webp",
        "20260315_222837_Kyle_Wheeler.webp",
        "20260315_222839_Kyle_Wheeler.webp"
      ]
    },
    {
      "name": "Nathan Moelis",
      "slug": "nathan-moelis",
      "character": "Marty Mauser",
      "movie": "Marty Supreme",
      "images": [
        "20260315_182041_Garrit_Strenge.webp",
        "20260315_182042_Garrit_Strenge.webp",
        "20260315_182044_Garrit_Strenge.webp",
        "20260315_182045_Garrit_Strenge.webp",
        "20260315_182046_Garrit_Strenge.webp",
        "20260315_182052_Garrit_Strenge.webp",
        "20260315_182057_Garrit_Strenge.webp",
        "20260315_182058_Garrit_Strenge.webp",
        "20260315_182111_Garrit_Strenge.webp",
        "20260315_200730_Garrit_Strenge.webp",
        "20260315_200730_Garrit_Strenge_1.webp",
        "20260315_200731_Garrit_Strenge.webp",
        "20260315_200732_Garrit_Strenge.webp",
        "20260315_200732_Garrit_Strenge_1.webp",
        "20260315_200732_Garrit_Strenge_2.webp",
        "20260315_200733_Garrit_Strenge.webp",
        "20260315_200735_Garrit_Strenge.webp",
        "20260315_200749_Garrit_Strenge.webp",
        "20260315_200750_Garrit_Strenge.webp",
        "20260315_200752_Garrit_Strenge.webp",
        "20260315_182040_Kyle_Wheeler.webp",
        "20260315_182040_Kyle_Wheeler_1.webp",
        "20260315_182041_Kyle_Wheeler.webp",
        "20260315_182041_Kyle_Wheeler_1.webp",
        "20260315_182042_Kyle_Wheeler.webp",
        "20260315_182042_Kyle_Wheeler_1.webp",
        "20260315_182043_Kyle_Wheeler.webp",
        "20260315_182043_Kyle_Wheeler_1.webp",
        "20260315_182045_Kyle_Wheeler.webp",
        "20260315_182045_Kyle_Wheeler_1.webp",
        "20260315_182045_Kyle_Wheeler_2.webp",
        "20260315_182049_Kyle_Wheeler.webp",
        "20260315_182050_Kyle_Wheeler.webp",
        "20260315_182050_Kyle_Wheeler_1.webp",
        "20260315_182051_Kyle_Wheeler.webp",
        "20260315_182052_Kyle_Wheeler.webp",
        "20260315_182054_Kyle_Wheeler.webp",
        "20260315_182054_Kyle_Wheeler_1.webp",
        "20260315_182056_Kyle_Wheeler.webp",
        "20260315_182056_Kyle_Wheeler_1.webp",
        "20260315_182057_Kyle_Wheeler.webp",
        "20260315_182058_Kyle_Wheeler.webp",
        "20260315_182058_Kyle_Wheeler_1.webp",
        "20260315_182103_Kyle_Wheeler.webp",
        "20260315_182104_Kyle_Wheeler.webp",
        "20260315_182104_Kyle_Wheeler_1.webp",
        "20260315_182105_Kyle_Wheeler.webp",
        "20260315_182106_Kyle_Wheeler.webp",
        "20260315_182106_Kyle_Wheeler_1.webp",
        "20260315_182110_Kyle_Wheeler.webp",
        "20260315_182111_Kyle_Wheeler.webp",
        "20260315_182111_Kyle_Wheeler_1.webp",
        "20260315_182111_Kyle_Wheeler_2.webp",
        "20260315_221131_Kyle_Wheeler.webp",
        "20260315_222757_Kyle_Wheeler.webp",
        "20260315_222759_Kyle_Wheeler.webp",
        "20260315_222800_Kyle_Wheeler.webp",
        "20260315_222801_Kyle_Wheeler.webp",
        "20260315_222804_Kyle_Wheeler.webp",
        "20260315_222806_Kyle_Wheeler.webp",
        "20260315_222822_Kyle_Wheeler.webp",
        "20260315_222824_Kyle_Wheeler.webp",
        "20260315_222825_Kyle_Wheeler.webp",
        "20260315_222835_Kyle_Wheeler.webp",
        "20260315_222837_Kyle_Wheeler.webp",
        "20260315_222839_Kyle_Wheeler.webp"
      ]
    },
    {
      "name": "Nick Kasun",
      "slug": "nick-kasun",
      "character": "Sensei Sergio St. Carlos",
      "movie": "One Battle After Another",
      "images": [
        "20260315_221115_Garrit_Strenge.webp",
        "20260315_221138_Garrit_Strenge.webp",
        "20260315_221139_Garrit_Strenge.webp",
        "20260315_221140_Garrit_Strenge.webp",
        "20260315_221141_Garrit_Strenge.webp",
        "20260315_221141_Garrit_Strenge_1.webp",
        "20260315_221154_Garrit_Strenge.webp",
        "20260315_221155_Garrit_Strenge.webp",
        "20260315_221155_Garrit_Strenge_1.webp",
        "20260315_221156_Garrit_Strenge.webp",
        "20260315_221203_Garrit_Strenge.webp",
        "20260315_221205_Garrit_Strenge.webp",
        "20260315_221206_Garrit_Strenge.webp",
        "20260315_221207_Garrit_Strenge.webp",
        "20260315_221208_Garrit_Strenge.webp",
        "20260315_221208_Garrit_Strenge_1.webp"
      ]
    },
    {
      "name": "Nicole Abbatine",
      "slug": "nicole-abbatine",
      "character": "Liesl",
      "movie": "The Phoenician Scheme",
      "images": [
        "20260315_200840_Garrit_Strenge.webp",
        "20260315_200842_Garrit_Strenge.webp",
        "20260315_200843_Garrit_Strenge.webp",
        "20260315_200844_Garrit_Strenge.webp",
        "20260315_200845_Garrit_Strenge.webp",
        "20260315_200845_Garrit_Strenge_1.webp",
        "20260315_200846_Garrit_Strenge.webp",
        "20260315_200846_Garrit_Strenge_1.webp",
        "20260315_200847_Garrit_Strenge.webp",
        "20260315_221724_Kyle_Wheeler.webp",
        "20260315_221726_Kyle_Wheeler.webp",
        "20260315_221728_Kyle_Wheeler.webp",
        "20260315_221732_Kyle_Wheeler.webp",
        "20260315_221735_Kyle_Wheeler.webp",
        "20260315_221736_Kyle_Wheeler.webp",
        "20260315_221749_Kyle_Wheeler.webp",
        "20260315_221751_Kyle_Wheeler.webp",
        "20260315_221755_Kyle_Wheeler.webp",
        "20260315_221758_Kyle_Wheeler.webp"
      ]
    },
    {
      "name": "Pilar Hincapie",
      "slug": "pilar-hincapie",
      "character": "Willa Ferguson",
      "movie": "One Battle After Another",
      "images": [
        "20260315_221115_Garrit_Strenge.webp",
        "20260315_221138_Garrit_Strenge.webp",
        "20260315_221139_Garrit_Strenge.webp",
        "20260315_221140_Garrit_Strenge.webp",
        "20260315_221141_Garrit_Strenge.webp",
        "20260315_221141_Garrit_Strenge_1.webp",
        "20260315_221154_Garrit_Strenge.webp",
        "20260315_221155_Garrit_Strenge.webp",
        "20260315_221155_Garrit_Strenge_1.webp",
        "20260315_221156_Garrit_Strenge.webp",
        "20260315_221203_Garrit_Strenge.webp",
        "20260315_221205_Garrit_Strenge.webp",
        "20260315_221206_Garrit_Strenge.webp",
        "20260315_221207_Garrit_Strenge.webp",
        "20260315_221208_Garrit_Strenge.webp",
        "20260315_221208_Garrit_Strenge_1.webp"
      ]
    },
    {
      "name": "Simon Carapella",
      "slug": "simon-carapella",
      "character": "Teddy",
      "movie": "Bugonia",
      "images": [
        "20260315_181547_Garrit_Strenge.webp",
        "20260315_181548_Garrit_Strenge.webp",
        "20260315_181558_Garrit_Strenge.webp",
        "20260315_181611_Garrit_Strenge.webp",
        "20260315_181613_Garrit_Strenge.webp",
        "20260315_181617_Garrit_Strenge.webp",
        "20260315_221141_Garrit_Strenge_1.webp",
        "20260315_221154_Garrit_Strenge.webp",
        "20260315_221155_Garrit_Strenge.webp",
        "20260315_221155_Garrit_Strenge_1.webp",
        "20260315_221156_Garrit_Strenge.webp",
        "20260315_221203_Garrit_Strenge.webp",
        "20260315_221205_Garrit_Strenge.webp",
        "20260315_221206_Garrit_Strenge.webp",
        "20260315_221207_Garrit_Strenge.webp",
        "20260315_221208_Garrit_Strenge.webp",
        "20260315_221208_Garrit_Strenge_1.webp",
        "20260315_181535_Kyle_Wheeler.webp",
        "20260315_181537_Kyle_Wheeler.webp",
        "20260315_181546_Kyle_Wheeler.webp",
        "20260315_181548_Kyle_Wheeler.webp",
        "20260315_181549_Kyle_Wheeler.webp",
        "20260315_181552_Kyle_Wheeler.webp",
        "20260315_181553_Kyle_Wheeler.webp",
        "20260315_181556_Kyle_Wheeler.webp",
        "20260315_181557_Kyle_Wheeler.webp",
        "20260315_181558_Kyle_Wheeler.webp",
        "20260315_181558_Kyle_Wheeler_1.webp",
        "20260315_181558_Kyle_Wheeler_2.webp",
        "20260315_181559_Kyle_Wheeler.webp",
        "20260315_181559_Kyle_Wheeler_1.webp",
        "20260315_181600_Kyle_Wheeler.webp",
        "20260315_181600_Kyle_Wheeler_1.webp",
        "20260315_181601_Kyle_Wheeler.webp",
        "20260315_181601_Kyle_Wheeler_1.webp",
        "20260315_181601_Kyle_Wheeler_2.webp",
        "20260315_181604_Kyle_Wheeler.webp",
        "20260315_181605_Kyle_Wheeler.webp",
        "20260315_181605_Kyle_Wheeler_1.webp",
        "20260315_181605_Kyle_Wheeler_2.webp",
        "20260315_181606_Kyle_Wheeler.webp",
        "20260315_181606_Kyle_Wheeler_1.webp",
        "20260315_181609_Kyle_Wheeler.webp",
        "20260315_181610_Kyle_Wheeler.webp",
        "20260315_181611_Kyle_Wheeler.webp",
        "20260315_181612_Kyle_Wheeler.webp"
      ]
    },
    {
      "name": "Zoe Zents",
      "slug": "zoe-zents",
      "character": "Judy Hopps",
      "movie": "Zootopia 2",
      "images": [
        "20260315_182426_Garrit_Strenge.webp",
        "20260315_182428_Garrit_Strenge.webp",
        "20260315_182431_Garrit_Strenge.webp",
        "20260315_182433_Garrit_Strenge.webp",
        "20260315_182435_Garrit_Strenge.webp",
        "20260315_182436_Garrit_Strenge.webp",
        "20260315_182441_Garrit_Strenge.webp",
        "20260315_182542_Garrit_Strenge.webp",
        "20260315_221051_Garrit_Strenge.webp",
        "20260315_181411_Kyle_Wheeler.webp",
        "20260315_181411_Kyle_Wheeler_1.webp",
        "20260315_181622_Kyle_Wheeler.webp",
        "20260315_182357_Kyle_Wheeler.webp",
        "20260315_182358_Kyle_Wheeler.webp",
        "20260315_182359_Kyle_Wheeler.webp",
        "20260315_182401_Kyle_Wheeler.webp",
        "20260315_182402_Kyle_Wheeler.webp",
        "20260315_182403_Kyle_Wheeler.webp",
        "20260315_182404_Kyle_Wheeler.webp",
        "20260315_182406_Kyle_Wheeler.webp",
        "20260315_182415_Kyle_Wheeler.webp",
        "20260315_182416_Kyle_Wheeler.webp",
        "20260315_182416_Kyle_Wheeler_1.webp",
        "20260315_182416_Kyle_Wheeler_2.webp",
        "20260315_182417_Kyle_Wheeler.webp",
        "20260315_182417_Kyle_Wheeler_1.webp",
        "20260315_182417_Kyle_Wheeler_2.webp",
        "20260315_182418_Kyle_Wheeler.webp",
        "20260315_182418_Kyle_Wheeler_1.webp",
        "20260315_182419_Kyle_Wheeler.webp",
        "20260315_182421_Kyle_Wheeler.webp",
        "20260315_182422_Kyle_Wheeler.webp",
        "20260315_182437_Kyle_Wheeler.webp",
        "20260315_182438_Kyle_Wheeler.webp",
        "20260315_182439_Kyle_Wheeler.webp",
        "20260315_182439_Kyle_Wheeler_1.webp",
        "20260315_182440_Kyle_Wheeler.webp",
        "20260315_182441_Kyle_Wheeler.webp",
        "20260315_182441_Kyle_Wheeler_1.webp",
        "20260315_182442_Kyle_Wheeler.webp",
        "20260315_182442_Kyle_Wheeler_1.webp",
        "20260315_182525_Kyle_Wheeler.webp"
      ]
    },
    {
      "name": "Kim Rosell",
      "slug": "kim-rosell",
      "character": "Lilo",
      "movie": "Lilo & Stitch",
      "images": []
    },
    {
      "name": "Michael Pond",
      "slug": "michael-pond",
      "character": "Stitch",
      "movie": "Lilo & Stitch",
      "images": []
    }
  ],
    movies: [
      { title: "Zootopia 2", director: "Jared Bush", imdb: "https://imdb.com/title/tt14948432" },
      { title: "Sentimental Value", director: "TBD", imdb: "#" },
      { title: "Black Panther: Wakanda Forever", director: "Ryan Coogler", imdb: "https://imdb.com/title/tt9114286" },
      { title: "The Bride!", director: "Maggie Gyllenhaal", imdb: "#" },
      { title: "Nosferatu", director: "Robert Eggers", imdb: "https://imdb.com/title/tt5040012" },
      { title: "Sinners", director: "Ryan Coogler", imdb: "#" },
    ],
  },
};

const PEOPLE_INDEX = (() => {
  const people = {};
  Object.values(CEREMONY_DATA).forEach((ceremony) => {
    ceremony.attendees.forEach((a) => {
      if (!people[a.slug]) {
        people[a.slug] = { name: a.name, slug: a.slug, years: {} };
      }
      people[a.slug].years[ceremony.year] = {
        character: a.character,
        movie: a.movie,
        images: a.images,
      };
    });
  });
  return people;
})();

// ─── PLACEHOLDER IMAGE GENERATOR ────────────────────────────────────────────
// Generates colored SVG placeholders based on filename hash
function placeholderImage(filename, size = "thumb") {
  const hash = [...filename].reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0);
  const hue = Math.abs(hash) % 360;
  const w = size === "full" ? 1200 : 400;
  const h = size === "full" ? 800 : 267;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:hsl(${hue},40%,25%)"/>
      <stop offset="100%" style="stop-color:hsl(${(hue + 40) % 360},50%,15%)"/>
    </linearGradient></defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="50%" y="45%" text-anchor="middle" fill="rgba(255,255,255,0.15)" font-size="${size === 'full' ? 48 : 18}" font-family="serif">${SITE_TITLE}</text>
    <text x="50%" y="60%" text-anchor="middle" fill="rgba(255,255,255,0.08)" font-size="${size === 'full' ? 20 : 10}" font-family="monospace">${filename}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function getImageUrl(filename, size = "thumb") {
  if (!filename) return "";
  const base = import.meta.env.BASE_URL;
  // .webp files are used for thumbnails; swap to .JPG for full-quality lightbox
  if (size === "full") return `${base}imgs/${filename.replace(/\.webp$/i, ".JPG")}`;
  return `${base}imgs/${filename}`;
}

// ─── ROUTER ─────────────────────────────────────────────────────────────────
function useHashRouter() {
  const [route, setRoute] = useState(window.location.hash || "#/");
  useEffect(() => {
    const handler = () => setRoute(window.location.hash || "#/");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  return route;
}

function navigate(hash) {
  window.location.hash = hash;
}

function Link({ to, children, className = "", style = {} }) {
  return (
    <a
      href={to}
      className={className}
      style={{ textDecoration: "none", color: "inherit", ...style }}
      onClick={(e) => { e.preventDefault(); navigate(to); window.scrollTo(0, 0); }}
    >
      {children}
    </a>
  );
}

// ─── ICONS (inline SVG) ─────────────────────────────────────────────────────
const Icons = {
  download: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
  ),
  x: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  ),
  chevronLeft: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
  ),
  chevronRight: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  film: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>
  ),
  users: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
  ),
  grid: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
  ),
};

// ─── STYLES ─────────────────────────────────────────────────────────────────
const GOLD = "#C5A258";
const GOLD_LIGHT = "#D4B96E";
const GOLD_DARK = "#9A7D3A";
const BG_PRIMARY = "#0A0A0A";
const BG_SECONDARY = "#111111";
const BG_CARD = "#1A1A1A";
const TEXT_PRIMARY = "#F5F0E8";
const TEXT_DIM = "#8A8478";
const BORDER = "#2A2520";

// ─── GLOBAL STYLES ──────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Outfit:wght@300;400;500;600&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      background: ${BG_PRIMARY};
      color: ${TEXT_PRIMARY};
      font-family: 'Outfit', sans-serif;
      font-weight: 300;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }
    ::selection { background: ${GOLD}33; color: ${GOLD_LIGHT}; }
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: ${BG_PRIMARY}; }
    ::-webkit-scrollbar-thumb { background: ${BORDER}; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: ${GOLD_DARK}; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes goldPulse {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 0.8; }
    }
    .stagger-1 { animation-delay: 0.05s; }
    .stagger-2 { animation-delay: 0.1s; }
    .stagger-3 { animation-delay: 0.15s; }
    .stagger-4 { animation-delay: 0.2s; }
    .stagger-5 { animation-delay: 0.25s; }
    .stagger-6 { animation-delay: 0.3s; }
  `}</style>
);

// ─── HEADER / NAV ───────────────────────────────────────────────────────────
function Header() {
  const route = useHashRouter();
  const isHome = route === "#/" || route === "";
  
  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: `linear-gradient(180deg, ${BG_PRIMARY} 0%, ${BG_PRIMARY}ee 60%, transparent 100%)`,
      padding: "0 0 20px 0",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "18px 24px 0",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Link to="#/" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: "50%",
            background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
            color: BG_PRIMARY, letterSpacing: -1,
          }}>C</div>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600,
            color: GOLD_LIGHT, letterSpacing: 2, textTransform: "uppercase",
          }}>{SITE_TITLE}</span>
        </Link>
        <nav style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {[
            { label: "Ceremonies", to: "#/ceremonies/2026" },
            { label: "People", to: "#/people" },
            { label: "Movies", to: "#/movies" },
          ].map((item) => {
            const active = route.startsWith(item.to.replace("/2026", ""));
            return (
              <Link key={item.label} to={item.to} style={{
                fontSize: 13, fontWeight: 400, letterSpacing: 1.5,
                textTransform: "uppercase",
                color: active ? GOLD_LIGHT : TEXT_DIM,
                transition: "color 0.2s",
                borderBottom: active ? `1px solid ${GOLD}44` : "1px solid transparent",
                paddingBottom: 2,
              }}>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

// ─── YEAR SELECTOR (Oscars.org style) ───────────────────────────────────────
function YearSelector({ activeYear }) {
  const years = Object.keys(CEREMONY_DATA).map(Number).sort();

  return (
    <div style={{
      borderBottom: `1px solid ${BORDER}`,
      padding: "0 24px",
      background: BG_SECONDARY,
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "flex", alignItems: "stretch", gap: 0,
      }}>
        {years.map((y) => (
          <Link key={y} to={`#/ceremonies/${y}`} style={{
            padding: "16px 32px",
            fontSize: 15, fontWeight: activeYear === y ? 500 : 300,
            letterSpacing: 1,
            color: activeYear === y ? GOLD_LIGHT : TEXT_DIM,
            borderBottom: activeYear === y ? `2px solid ${GOLD}` : "2px solid transparent",
            transition: "all 0.2s",
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 20,
          }}>
            {y}
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── GALLERY FILTER BAR ─────────────────────────────────────────────────────
function FilterBar({ filters, activeFilter, onFilter, secondaryFilters, activeSecondary, onSecondary }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: secondaryFilters ? 16 : 0 }}>
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => onFilter(f.value)}
            style={{
              padding: "8px 18px", borderRadius: 100,
              border: `1px solid ${activeFilter === f.value ? GOLD : BORDER}`,
              background: activeFilter === f.value ? `${GOLD}18` : "transparent",
              color: activeFilter === f.value ? GOLD_LIGHT : TEXT_DIM,
              fontSize: 13, fontWeight: 400, cursor: "pointer",
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: 0.5,
              transition: "all 0.2s",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>
      {secondaryFilters && secondaryFilters.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {secondaryFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => onSecondary(f.value)}
              style={{
                padding: "5px 14px", borderRadius: 100,
                border: `1px solid ${activeSecondary === f.value ? GOLD_DARK : BORDER}`,
                background: activeSecondary === f.value ? `${GOLD_DARK}22` : "transparent",
                color: activeSecondary === f.value ? GOLD_LIGHT : TEXT_DIM,
                fontSize: 11, fontWeight: 300, cursor: "pointer",
                fontFamily: "'Outfit', sans-serif",
                letterSpacing: 0.3,
                transition: "all 0.2s",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PHOTO GALLERY ──────────────────────────────────────────────────────────
function GalleryImage({ filename, year, attendeeName, character, movie, index, selected, onSelect, onClick, selectMode }) {
  const [loaded, setLoaded] = useState(false);
  const src = getImageUrl(filename, "thumb");

  return (
    <div
      style={{
        position: "relative", borderRadius: 6, overflow: "hidden",
        cursor: "pointer", aspectRatio: "3/2",
        animation: "fadeUp 0.4s ease both",
        animationDelay: `${Math.min(index * 0.03, 0.5)}s`,
      }}
      onClick={() => selectMode ? onSelect(filename) : onClick()}
    >
      {!loaded && (
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(90deg, ${BG_CARD} 25%, #222 50%, ${BG_CARD} 75%)`,
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
        }} />
      )}
      <img
        src={src}
        alt={`${attendeeName} as ${character}`}
        loading="lazy"
        width={400} height={267}
        onLoad={() => setLoaded(true)}
        style={{
          width: "100%", height: "100%", objectFit: "cover",
          opacity: loaded ? 1 : 0, transition: "opacity 0.3s, transform 0.3s",
          display: "block",
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.03)"}
        onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
      />
      {selectMode && (
        <div
          onClick={(e) => { e.stopPropagation(); onSelect(filename); }}
          style={{
            position: "absolute", top: 8, left: 8, width: 24, height: 24,
            borderRadius: 4, border: `2px solid ${selected ? GOLD : "rgba(255,255,255,0.5)"}`,
            background: selected ? GOLD : "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.15s",
          }}
        >
          {selected && Icons.check}
        </div>
      )}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "24px 10px 8px",
        background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
        pointerEvents: "none",
      }}>
        <div style={{ fontSize: 12, fontWeight: 400, color: TEXT_PRIMARY, lineHeight: 1.3 }}>
          {attendeeName}
        </div>
        <div style={{ fontSize: 10, color: TEXT_DIM }}>
          {character} · {movie}
        </div>
      </div>
    </div>
  );
}

function PhotoGallery({ images, year }) {
  const [filter, setFilter] = useState("all");
  const [secondaryFilter, setSecondaryFilter] = useState("all");
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [lightbox, setLightbox] = useState(null);
  const ceremony = CEREMONY_DATA[year];

  // Build flat image list with metadata
  const allImages = useMemo(() => {
    const list = [];
    ceremony.attendees.forEach((a) => {
      a.images.forEach((img) => {
        list.push({ filename: img, attendeeName: a.name, slug: a.slug, character: a.character, movie: a.movie, year });
      });
    });
    return list;
  }, [year]);

  // Filter options
  const personFilters = [{ value: "all", label: "All" }, ...ceremony.attendees.map((a) => ({ value: a.slug, label: a.name }))];
  const movieFilters = useMemo(() => {
    if (filter === "all") return [];
    const attendee = ceremony.attendees.find((a) => a.slug === filter);
    return attendee ? [] : [];
  }, [filter]);

  const characterFilters = useMemo(() => {
    const chars = [...new Set(ceremony.attendees.map((a) => a.character))];
    return [{ value: "all", label: "All Characters" }, ...chars.map((c) => ({ value: c, label: c }))];
  }, [year]);

  const movieFilterOptions = useMemo(() => {
    const movies = [...new Set(ceremony.attendees.map((a) => a.movie))];
    return [{ value: "all", label: "All Movies" }, ...movies.map((m) => ({ value: m, label: m }))];
  }, [year]);

  // Main filter: person, then secondary: character or movie
  const [filterMode, setFilterMode] = useState("person"); // person | character | movie
  const primaryFilters = filterMode === "person" ? personFilters : filterMode === "character" ? characterFilters : movieFilterOptions;

  const filteredImages = useMemo(() => {
    return allImages.filter((img) => {
      if (filter === "all") return true;
      if (filterMode === "person") return img.slug === filter;
      if (filterMode === "character") return img.character === filter;
      if (filterMode === "movie") return img.movie === filter;
      return true;
    });
  }, [allImages, filter, filterMode]);

  const toggleSelect = (filename) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(filename) ? next.delete(filename) : next.add(filename);
      return next;
    });
  };

  const lightboxImages = filteredImages;
  const lightboxIndex = lightbox !== null ? lightboxImages.findIndex((img) => img.filename === lightbox) : -1;

  return (
    <div>
      {/* Filter mode tabs */}
      <div style={{ display: "flex", gap: 24, marginBottom: 16, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: TEXT_DIM, textTransform: "uppercase", letterSpacing: 1 }}>Filter by:</span>
        {["person", "character", "movie"].map((mode) => (
          <button
            key={mode}
            onClick={() => { setFilterMode(mode); setFilter("all"); }}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 12, fontWeight: filterMode === mode ? 500 : 300,
              color: filterMode === mode ? GOLD_LIGHT : TEXT_DIM,
              textTransform: "capitalize", fontFamily: "'Outfit', sans-serif",
              borderBottom: filterMode === mode ? `1px solid ${GOLD}` : "none",
              paddingBottom: 2, letterSpacing: 0.5,
            }}
          >
            {mode}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button
          onClick={() => { setSelectMode(!selectMode); setSelected(new Set()); }}
          style={{
            background: selectMode ? `${GOLD}22` : "none",
            border: `1px solid ${selectMode ? GOLD : BORDER}`,
            borderRadius: 6, padding: "6px 14px", cursor: "pointer",
            color: selectMode ? GOLD_LIGHT : TEXT_DIM,
            fontSize: 12, fontFamily: "'Outfit', sans-serif",
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          {Icons.grid} {selectMode ? "Cancel" : "Select"}
        </button>
      </div>

      <FilterBar filters={primaryFilters} activeFilter={filter} onFilter={setFilter} />

      {/* Select actions bar */}
      {selectMode && selected.size > 0 && (
        <div style={{
          display: "flex", gap: 12, marginBottom: 16, padding: "10px 16px",
          background: `${GOLD}11`, border: `1px solid ${GOLD}33`, borderRadius: 8,
          alignItems: "center",
        }}>
          <span style={{ fontSize: 13, color: GOLD_LIGHT }}>{selected.size} selected</span>
          <div style={{ flex: 1 }} />
          <button
            onClick={() => setSelected(new Set(filteredImages.map((i) => i.filename)))}
            style={{
              background: "none", border: `1px solid ${BORDER}`, borderRadius: 6,
              padding: "5px 12px", color: TEXT_DIM, fontSize: 12, cursor: "pointer",
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            Select All
          </button>
          <button
            onClick={() => {
              // In production: use JSZip to bundle selected full-res images
              alert(`Download ${selected.size} photos\n\nIn production, this uses JSZip to bundle:\n${[...selected].join("\n")}`);
            }}
            style={{
              background: `linear-gradient(135deg, ${GOLD_DARK}, ${GOLD})`,
              border: "none", borderRadius: 6, padding: "6px 16px",
              color: BG_PRIMARY, fontSize: 12, fontWeight: 500, cursor: "pointer",
              fontFamily: "'Outfit', sans-serif",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            {Icons.download} Download ({selected.size})
          </button>
        </div>
      )}

      {/* Gallery Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 12,
      }}>
        {filteredImages.map((img, i) => (
          <GalleryImage
            key={`${img.slug}-${img.filename}`}
            {...img}
            index={i}
            selected={selected.has(img.filename)}
            onSelect={toggleSelect}
            onClick={() => setLightbox(img.filename)}
            selectMode={selectMode}
          />
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div style={{ textAlign: "center", padding: 60, color: TEXT_DIM }}>
          No photos found for this filter.
        </div>
      )}

      {/* Lightbox */}
      {lightbox && lightboxIndex >= 0 && (
        <Lightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightbox(null)}
          onNavigate={(idx) => setLightbox(lightboxImages[idx].filename)}
        />
      )}
    </div>
  );
}

// ─── LIGHTBOX WITH WATERMARK ────────────────────────────────────────────────
function Lightbox({ images, currentIndex, onClose, onNavigate }) {
  const canvasRef = useRef(null);
  const current = images[currentIndex];

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && currentIndex > 0) onNavigate(currentIndex - 1);
      if (e.key === "ArrowRight" && currentIndex < images.length - 1) onNavigate(currentIndex + 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentIndex, images.length]);

  // Render watermarked preview on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      // Watermark
      ctx.save();
      ctx.globalAlpha = 0.15;
      ctx.font = `bold ${Math.max(img.width / 12, 36)}px 'Cormorant Garamond', serif`;
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.translate(img.width / 2, img.height / 2);
      ctx.rotate(-0.3);
      ctx.fillText(`${SITE_TITLE}`, 0, 0);
      ctx.font = `${Math.max(img.width / 30, 14)}px 'Outfit', sans-serif`;
      ctx.fillText("© " + (current.year || ""), 0, img.width / 12);
      ctx.restore();
    };
    img.src = getImageUrl(current.filename, "full");
  }, [current]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.92)",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "fadeIn 0.2s ease",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: "absolute", top: 20, right: 20, background: "none",
          border: "none", color: TEXT_PRIMARY, cursor: "pointer", zIndex: 10,
          opacity: 0.7, transition: "opacity 0.2s",
        }}
        onMouseOver={(e) => e.currentTarget.style.opacity = 1}
        onMouseOut={(e) => e.currentTarget.style.opacity = 0.7}
      >
        {Icons.x}
      </button>

      {/* Nav arrows */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex - 1); }}
          style={{
            position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
            background: "rgba(0,0,0,0.4)", border: "none", borderRadius: "50%",
            width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center",
            color: TEXT_PRIMARY, cursor: "pointer", zIndex: 10,
          }}
        >
          {Icons.chevronLeft}
        </button>
      )}
      {currentIndex < images.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex + 1); }}
          style={{
            position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
            background: "rgba(0,0,0,0.4)", border: "none", borderRadius: "50%",
            width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center",
            color: TEXT_PRIMARY, cursor: "pointer", zIndex: 10,
          }}
        >
          {Icons.chevronRight}
        </button>
      )}

      {/* Canvas with watermark */}
      <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: "85vw", maxHeight: "80vh", position: "relative" }}>
        <canvas
          ref={canvasRef}
          style={{ maxWidth: "85vw", maxHeight: "75vh", borderRadius: 4, display: "block" }}
        />
        {/* Info & download bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 0", gap: 16,
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 400, color: TEXT_PRIMARY }}>
              {current.attendeeName} <span style={{ color: TEXT_DIM }}>as</span> {current.character}
            </div>
            <div style={{ fontSize: 12, color: TEXT_DIM }}>{current.movie} · {current.year}</div>
          </div>
          <button
            onClick={() => {
              // In production: trigger download of the full-res image (no watermark)
              const link = document.createElement("a");
              link.href = getImageUrl(current.filename, "full");
              link.download = current.filename.replace("_thumb", "_full");
              link.click();
            }}
            style={{
              background: `linear-gradient(135deg, ${GOLD_DARK}, ${GOLD})`,
              border: "none", borderRadius: 6, padding: "8px 20px",
              color: BG_PRIMARY, fontSize: 13, fontWeight: 500, cursor: "pointer",
              fontFamily: "'Outfit', sans-serif",
              display: "flex", alignItems: "center", gap: 8,
              whiteSpace: "nowrap",
            }}
          >
            {Icons.download} Download (no watermark)
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: HOME ─────────────────────────────────────────────────────────────
function HomePage() {
  const years = Object.keys(CEREMONY_DATA).map(Number).sort().reverse();

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Hero */}
      <section style={{
        minHeight: "70vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "80px 24px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse at 50% 30%, ${GOLD}08 0%, transparent 70%)`,
        }} />
        <div style={{
          width: 80, height: 80, borderRadius: "50%", marginBottom: 32,
          background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 40, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
          color: BG_PRIMARY,
          animation: "fadeUp 0.6s ease both",
          boxShadow: `0 0 60px ${GOLD}22`,
        }}>C</div>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(42px, 7vw, 80px)",
          fontWeight: 300, letterSpacing: 6, color: TEXT_PRIMARY,
          animation: "fadeUp 0.6s ease both", animationDelay: "0.1s",
          textTransform: "uppercase", lineHeight: 1.1,
        }}>
          Cali's<br />
          <span style={{ color: GOLD_LIGHT, fontWeight: 600 }}>Oscars</span>
        </h1>
        <p style={{
          marginTop: 20, fontSize: 16, fontWeight: 300, color: TEXT_DIM,
          maxWidth: 480, lineHeight: 1.7, letterSpacing: 0.5,
          animation: "fadeUp 0.6s ease both", animationDelay: "0.2s",
        }}>
          An annual celebration of cinema, costumes, and community.
          Browse photos from every ceremony.
        </p>
        <div style={{
          marginTop: 40, display: "flex", gap: 16,
          animation: "fadeUp 0.6s ease both", animationDelay: "0.3s",
        }}>
          {years.map((y) => (
            <Link key={y} to={`#/ceremonies/${y}`} style={{
              padding: "14px 36px", borderRadius: 4,
              background: y === years[0] ? `linear-gradient(135deg, ${GOLD_DARK}, ${GOLD})` : "transparent",
              border: y === years[0] ? "none" : `1px solid ${BORDER}`,
              color: y === years[0] ? BG_PRIMARY : TEXT_DIM,
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 20, fontWeight: 500, letterSpacing: 2,
              transition: "all 0.2s",
            }}>
              {y}
            </Link>
          ))}
        </div>
      </section>

      {/* Quick stats */}
      <section style={{
        maxWidth: 1200, margin: "0 auto", padding: "40px 24px 80px",
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 24,
      }}>
        {[
          { label: "Ceremonies", value: years.length },
          { label: "Guests", value: Object.keys(PEOPLE_INDEX).length },
          { label: "Photos", value: Object.values(CEREMONY_DATA).reduce((sum, c) => sum + c.attendees.reduce((s, a) => s + a.images.length, 0), 0) },
          { label: "Movies Represented", value: Object.values(CEREMONY_DATA).reduce((sum, c) => sum + c.movies.length, 0) },
        ].map((stat, i) => (
          <div key={stat.label} style={{
            textAlign: "center", padding: "28px 16px",
            border: `1px solid ${BORDER}`, borderRadius: 8,
            background: BG_SECONDARY,
            animation: "fadeUp 0.5s ease both",
            animationDelay: `${0.4 + i * 0.08}s`,
          }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 36,
              fontWeight: 600, color: GOLD_LIGHT,
            }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: TEXT_DIM, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 4 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

// ─── PAGE: CEREMONY ─────────────────────────────────────────────────────────
function CeremonyPage({ year }) {
  const ceremony = CEREMONY_DATA[year];
  if (!ceremony) return <div style={{ padding: "120px 24px", textAlign: "center", color: TEXT_DIM }}>Ceremony not found.</div>;

  return (
    <div style={{ paddingTop: 80 }}>
      <YearSelector activeYear={year} />

      {/* Hero section */}
      <section style={{
        maxWidth: 1200, margin: "0 auto", padding: "60px 24px 40px",
      }}>
        <div style={{ animation: "fadeUp 0.5s ease both" }}>
          <div style={{
            fontSize: 12, color: GOLD, letterSpacing: 3, textTransform: "uppercase",
            marginBottom: 8, fontWeight: 500,
          }}>
            The {ceremony.ordinal} Annual
          </div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 5vw, 56px)",
            fontWeight: 300, letterSpacing: 3, lineHeight: 1.1,
          }}>
            <span style={{ color: GOLD_LIGHT, fontWeight: 600 }}>{SITE_TITLE}</span>{" "}
            <span style={{ color: TEXT_PRIMARY }}>{year}</span>
          </h1>
          <div style={{ fontSize: 14, color: TEXT_DIM, marginTop: 8, letterSpacing: 0.5 }}>
            {ceremony.date}
          </div>
        </div>
        <p style={{
          marginTop: 24, fontSize: 16, lineHeight: 1.8, color: TEXT_DIM,
          maxWidth: 720, fontWeight: 300,
          animation: "fadeUp 0.5s ease both", animationDelay: "0.1s",
        }}>
          {ceremony.bio}
        </p>
      </section>

      {/* Attendee cards */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 40px" }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 400,
          color: TEXT_PRIMARY, marginBottom: 20, letterSpacing: 1,
          animation: "fadeUp 0.5s ease both", animationDelay: "0.15s",
        }}>
          Guests
        </h2>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 12,
        }}>
          {ceremony.attendees.map((a, i) => (
            <Link key={a.slug} to={`#/people/${a.slug}`} style={{
              padding: "16px 18px", borderRadius: 8,
              background: BG_CARD, border: `1px solid ${BORDER}`,
              transition: "all 0.2s",
              animation: "fadeUp 0.4s ease both",
              animationDelay: `${0.2 + i * 0.04}s`,
            }}>
              <div style={{ fontSize: 15, fontWeight: 400, color: TEXT_PRIMARY }}>{a.name}</div>
              <div style={{ fontSize: 12, color: GOLD, marginTop: 4 }}>{a.character}</div>
              <div style={{ fontSize: 11, color: TEXT_DIM }}>{a.movie} · {a.images.length} photos</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Photo Gallery */}
      <section style={{
        maxWidth: 1200, margin: "0 auto", padding: "20px 24px 80px",
      }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 400,
          color: TEXT_PRIMARY, marginBottom: 24, letterSpacing: 1,
        }}>
          Photo Gallery
        </h2>
        <PhotoGallery images={[]} year={year} />
      </section>
    </div>
  );
}

// ─── PAGE: PEOPLE INDEX ─────────────────────────────────────────────────────
function PeoplePage() {
  const people = Object.values(PEOPLE_INDEX).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div style={{ paddingTop: 80 }}>
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32, animation: "fadeUp 0.5s ease both" }}>
          <span style={{ color: GOLD }}>{Icons.users}</span>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: 40,
            fontWeight: 400, letterSpacing: 2,
          }}>
            All Guests
          </h1>
        </div>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 16,
        }}>
          {people.map((person, i) => {
            const yearKeys = Object.keys(person.years).sort().reverse();
            return (
              <Link key={person.slug} to={`#/people/${person.slug}`} style={{
                padding: "20px 24px", borderRadius: 8,
                background: BG_CARD, border: `1px solid ${BORDER}`,
                transition: "all 0.25s",
                animation: "fadeUp 0.4s ease both",
                animationDelay: `${i * 0.04}s`,
              }}>
                <div style={{ fontSize: 18, fontWeight: 400, color: TEXT_PRIMARY, marginBottom: 8 }}>
                  {person.name}
                </div>
                {yearKeys.map((yr) => (
                  <div key={yr} style={{ fontSize: 12, color: TEXT_DIM, marginTop: 4 }}>
                    <span style={{ color: GOLD, fontWeight: 500 }}>{yr}</span>{" "}
                    — {person.years[yr].character} ({person.years[yr].movie})
                  </div>
                ))}
                <div style={{ fontSize: 11, color: TEXT_DIM, marginTop: 8 }}>
                  {yearKeys.length} {yearKeys.length === 1 ? "ceremony" : "ceremonies"} ·{" "}
                  {Object.values(person.years).reduce((sum, y) => sum + y.images.length, 0)} photos
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

// ─── PAGE: PERSON DETAIL ────────────────────────────────────────────────────
function PersonPage({ slug }) {
  const person = PEOPLE_INDEX[slug];
  if (!person) return <div style={{ padding: "120px 24px", textAlign: "center", color: TEXT_DIM }}>Person not found.</div>;

  const years = Object.keys(person.years).sort().reverse();
  const [activeYear, setActiveYear] = useState(years[0]);
  const yearData = person.years[activeYear];

  // Build images for gallery
  const allImages = yearData.images.map((img) => ({
    filename: img,
    attendeeName: person.name,
    slug: person.slug,
    character: yearData.character,
    movie: yearData.movie,
    year: Number(activeYear),
  }));

  const [lightbox, setLightbox] = useState(null);
  const lightboxIndex = lightbox !== null ? allImages.findIndex((i) => i.filename === lightbox) : -1;

  return (
    <div style={{ paddingTop: 80 }}>
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px 80px" }}>
        <Link to="#/people" style={{ fontSize: 12, color: TEXT_DIM, letterSpacing: 1, display: "inline-block", marginBottom: 24 }}>
          ← All Guests
        </Link>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 5vw, 48px)",
          fontWeight: 400, letterSpacing: 2, marginBottom: 8,
          animation: "fadeUp 0.5s ease both",
        }}>
          {person.name}
        </h1>

        {/* Year tabs */}
        <div style={{ display: "flex", gap: 16, marginBottom: 32, marginTop: 16 }}>
          {years.map((yr) => (
            <button
              key={yr}
              onClick={() => setActiveYear(yr)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "'Cormorant Garamond', serif", fontSize: 22,
                fontWeight: activeYear === yr ? 600 : 300,
                color: activeYear === yr ? GOLD_LIGHT : TEXT_DIM,
                borderBottom: activeYear === yr ? `2px solid ${GOLD}` : "2px solid transparent",
                padding: "4px 8px", transition: "all 0.2s",
              }}
            >
              {yr}
            </button>
          ))}
        </div>

        <div style={{
          padding: "16px 20px", background: BG_CARD, borderRadius: 8,
          border: `1px solid ${BORDER}`, marginBottom: 32, display: "inline-block",
        }}>
          <div style={{ fontSize: 14, color: TEXT_PRIMARY }}>
            Dressed as <span style={{ color: GOLD_LIGHT, fontWeight: 500 }}>{yearData.character}</span>
          </div>
          <div style={{ fontSize: 12, color: TEXT_DIM, marginTop: 2 }}>from {yearData.movie}</div>
        </div>

        {/* Photo grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 12,
        }}>
          {allImages.map((img, i) => (
            <GalleryImage
              key={`${img.slug}-${img.filename}`}
              {...img}
              index={i}
              selected={false}
              onSelect={() => {}}
              onClick={() => setLightbox(img.filename)}
              selectMode={false}
            />
          ))}
        </div>

        {lightbox && lightboxIndex >= 0 && (
          <Lightbox
            images={allImages}
            currentIndex={lightboxIndex}
            onClose={() => setLightbox(null)}
            onNavigate={(idx) => setLightbox(allImages[idx].filename)}
          />
        )}
      </section>
    </div>
  );
}

// ─── PAGE: MOVIES ───────────────────────────────────────────────────────────
function MoviesPage() {
  const years = Object.keys(CEREMONY_DATA).map(Number).sort().reverse();

  return (
    <div style={{ paddingTop: 80 }}>
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40, animation: "fadeUp 0.5s ease both" }}>
          <span style={{ color: GOLD }}>{Icons.film}</span>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: 40,
            fontWeight: 400, letterSpacing: 2,
          }}>
            Movies
          </h1>
        </div>

        {years.map((yr) => {
          const ceremony = CEREMONY_DATA[yr];
          return (
            <div key={yr} style={{ marginBottom: 48 }}>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: 28,
                fontWeight: 600, color: GOLD_LIGHT, letterSpacing: 2, marginBottom: 16,
              }}>
                {yr}
              </h2>
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 12,
              }}>
                {ceremony.movies.map((movie, i) => {
                  const attendees = ceremony.attendees.filter((a) => a.movie === movie.title);
                  return (
                    <div key={movie.title} style={{
                      padding: "20px 24px", borderRadius: 8,
                      background: BG_CARD, border: `1px solid ${BORDER}`,
                      animation: "fadeUp 0.4s ease both",
                      animationDelay: `${i * 0.05}s`,
                    }}>
                      <div style={{ fontSize: 17, fontWeight: 400, color: TEXT_PRIMARY, marginBottom: 4 }}>
                        {movie.title}
                      </div>
                      <div style={{ fontSize: 12, color: TEXT_DIM, marginBottom: 10 }}>
                        Dir. {movie.director}
                      </div>
                      {attendees.length > 0 && (
                        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 10 }}>
                          {attendees.map((a) => (
                            <Link key={a.slug} to={`#/people/${a.slug}`} style={{
                              display: "block", fontSize: 12, color: GOLD,
                              marginTop: 4, transition: "color 0.15s",
                            }}>
                              {a.name} as {a.character}
                            </Link>
                          ))}
                        </div>
                      )}
                      {movie.imdb && movie.imdb !== "#" && (
                        <a href={movie.imdb} target="_blank" rel="noreferrer" style={{
                          display: "inline-block", marginTop: 10, fontSize: 11,
                          color: TEXT_DIM, textDecoration: "underline", textUnderlineOffset: 3,
                        }}>
                          IMDb →
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

// ─── FOOTER ─────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      borderTop: `1px solid ${BORDER}`,
      padding: "40px 24px",
      textAlign: "center",
    }}>
      <div style={{
        fontFamily: "'Cormorant Garamond', serif", fontSize: 16,
        color: GOLD_DARK, letterSpacing: 3, textTransform: "uppercase",
        marginBottom: 8,
      }}>
        {SITE_TITLE}
      </div>
      <div style={{ fontSize: 11, color: TEXT_DIM, letterSpacing: 0.5 }}>
        A celebration of cinema, costumes, and community
      </div>
    </footer>
  );
}

// ─── APP ROUTER ─────────────────────────────────────────────────────────────
export default function App() {
  const route = useHashRouter();

  let page;
  if (route === "#/" || route === "" || route === "#") {
    page = <HomePage />;
  } else if (route.match(/^#\/ceremonies\/(\d{4})$/)) {
    const year = Number(route.match(/^#\/ceremonies\/(\d{4})$/)[1]);
    page = <CeremonyPage year={year} />;
  } else if (route === "#/people") {
    page = <PeoplePage />;
  } else if (route.match(/^#\/people\/(.+)$/)) {
    const slug = route.match(/^#\/people\/(.+)$/)[1];
    page = <PersonPage slug={slug} />;
  } else if (route === "#/movies") {
    page = <MoviesPage />;
  } else {
    page = (
      <div style={{ padding: "120px 24px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 300, color: TEXT_DIM }}>404</h1>
        <p style={{ color: TEXT_DIM, marginTop: 12 }}>Page not found.</p>
        <Link to="#/" style={{ color: GOLD, marginTop: 16, display: "inline-block", fontSize: 14 }}>← Back Home</Link>
      </div>
    );
  }

  return (
    <>
      <GlobalStyles />
      <Header />
      <main style={{ minHeight: "100vh" }}>{page}</main>
      <Footer />
    </>
  );
}
