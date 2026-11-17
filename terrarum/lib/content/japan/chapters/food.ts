import type { Chapter } from "../../types";

/** Brief section D for Japan. Every statement is from the source it cites. */
export const food: Chapter = {
  slug: "food",
  title: "Food",
  native: "食",
  summary: "A meal built around a bowl of rice, a stock made from seaweed and dried fish, and a map on which even the shape of a rice cake changes from east to west.",
  hero: "nishiki-seafood",
  facts: [
    { label: "Basic meal", value: "Rice, soup, pickles and three dishes", cite: ["maff-washoku"] },
    { label: "Umami identified", value: "1907, by Kikunae Ikeda", cite: ["maff-washoku"] },
    { label: "UNESCO listing of washoku", value: "2013", cite: ["unesco-washoku"] },
    { label: "Vegetables on sale", value: "About 150 kinds", cite: ["maff-washoku"] },
  ],
  passages: [
    {
      id: "food-rice",
      heading: "Everything is there to eat rice with",
      body: [
        "An ordinary meal at home is cooked rice, miso soup, a main dish, side dishes and pickles. The pattern has a name, “one soup and three dishes”: three dishes added to rice, soup and pickles, with the rice bowl set at the front left and the soup at the front right. Rice is the main dish. The soup, the pickles and everything else exist to be eaten with it.",
        "That is why the cuisine absorbs newcomers so easily. Stewed meat and potatoes, a croquette or a breaded pork cutlet all count as proper side dishes, so long as they go with rice. The rice itself is the short, sticky Japonica type, which is what makes rice balls and sushi possible. A second, stickier kind, glutinous rice, is kept for pounded rice cakes, mochi, and for the red rice of celebrations.",
      ],
      cite: ["maff-washoku"],
      covers: ["dishes", "everyday"],
      images: ["nishiki-tsukemono"],
      status: "fact-checked",
    },
    {
      id: "food-ingredients",
      heading: "Sea, field and soft water",
      body: [
        "The cooking rests on two things, vegetables and seafood. About 150 kinds of vegetable are sold in Japan, from daikon radish and turnip to wild mountain plants and mushrooms. The seas around the islands are rich fishing grounds, where the Japan Current and the Oyashio Current meet. Meat was a late arrival: eating it was generally forbidden until the country ended its seclusion. As early as 675, Emperor Tenmu had prohibited the eating of beef, horse, dog, monkey and chicken.",
        "Water matters as much as either. About 1,800 millimetres of rain fall in an average year, and because it spends little time underground the water is soft. Soft water draws the flavour out of kelp and dried bonito, and the taste of tofu depends on it.",
      ],
      cite: ["maff-washoku"],
      covers: ["ingredients"],
      images: ["nishiki-seafood", "nishiki-tofu"],
      places: ["nishiki-market"],
      status: "fact-checked",
    },
    {
      id: "food-dashi",
      heading: "Stock, and a fifth taste",
      body: [
        "The most important element of the taste is dashi, a stock that is the base of miso soup, clear soup and stewed dishes. It is made by steeping kombu kelp and katsuobushi, dried bonito, in water; dried small fish and dried shiitake mushrooms are used too. In 1907 Kikunae Ikeda found that one source of its savour, umami, is glutamic acid. Umami is now counted as a fifth taste alongside sweet, salty, sour and bitter.",
        "The seasonings are fermented ones, a habit of hot, humid summers: miso from soybeans, koji mould and salt; soy sauce, which comes in five kinds from dark to white; rice vinegar; and mirin, a sweet rice wine. Fermentation preserves as well as flavours. In narezushi, salted fish is packed with cooked rice and left to sour. Fresh fish is often not cooked at all. Sashimi is cut raw and served with soy sauce and wasabi, whose sharpness comes from a compound that also kills bacteria.",
      ],
      cite: ["maff-washoku"],
      covers: ["techniques"],
      status: "fact-checked",
    },
    {
      id: "food-history",
      heading: "What arrived, and when",
      body: [
        "Wet-field rice farming arrived in prehistory and became the base of everything. Much else came from China: tofu, and the powdered green tea that the monk Eisai brought back from Song China. Zen left a mark of its own. Dōgen wrote instructions for the monastery cook, and a cuisine made from plants alone was developed for Buddhists.",
        "The warrior class had its formal banquet style, honzen ryōri. The tea ceremony, brought to its finished form by Sen no Rikyū, produced kaiseki, the meal served with it. The Nanban trade with Europe brought chili pepper and Western sweets. In the Edo period the first printed cookbook appeared and eating houses spread through the cities.",
        "From the Meiji period Western restaurants opened, and home cookbooks taught half-Western dishes adapted to the rice bowl. The latest chapter is less happy: households eat less rice, and the country’s food self-sufficiency ratio is below 40%. In 2013 UNESCO added washoku, the traditional food culture of the Japanese, to its list of intangible heritage.",
      ],
      cite: ["maff-washoku", "unesco-washoku"],
      covers: ["history"],
      status: "fact-checked",
    },
    {
      id: "food-regions",
      heading: "East of the mochi line, and west",
      body: [
        "Regional difference shows even in a single bowl. Ozōni is the soup with mochi eaten on New Year’s Day. East of central Honshu the mochi in it is mostly square; west of there it is mostly round. In Tokyo the cake is grilled and set in a clear stock of dried bonito seasoned with soy sauce. Miso changes the same way: salty red miso in Sendai, mild sweet white miso in Kansai, dark soybean miso in the Hatchō style.",
        "Every region has dishes of its own. Kagawa, once Sanuki province, is said to eat more udon per head than anywhere else in Japan; its dough is trodden underfoot and its broth made from dried sardines. Hiroshima has farmed oysters for almost 500 years, on about 10,000 rafts in its bay. Nikkō is known for yuba, the skin lifted off boiling soy milk, which suited the vegetarian diet of its monks. Okinawa distils awamori, which in the seventeenth and eighteenth centuries could be made only in three villages near Shuri Castle. Osaka sums up its own priorities in a saying: Kyoto is all about clothes, Osaka is all about eating.",
      ],
      cite: ["maff-washoku", "jta-h30-01110", "jta-r2-01903", "jta-r1-00503", "visitnikko-yuba", "jta-r1-01304", "osaka-kuidaore"],
      covers: ["regional"],
      images: ["takamatsu-udon", "izumo-soba"],
      places: ["dotonbori", "nishiki-market"],
      status: "fact-checked",
    },
    {
      id: "food-street",
      heading: "Fast food, Edo style",
      body: [
        "Some of the most famous dishes began as street food. Nigiri sushi was born at street stalls in Edo in the 1800s, when the city already held a million people. It is credited to Hanaya Yohei of Ryōgoku, and it was fast food for townspeople. With no refrigeration, the fish was marinated, cured or simmered first. Soba noodles were a popular quick meal in the same city by the middle of the Edo period.",
        "The habit continued. Hiroshima’s okonomiyaki, a thin batter base with cabbage, noodles and other ingredients layered on top, not mixed in, grew out of a cheap children’s snack in the years after the war, when stalls often run by war widows were part of the city’s recovery. The city now has well over a thousand okonomiyaki restaurants.",
      ],
      cite: ["gotokyo-localfood", "gotokyo-edomae", "jta-r1-00502"],
      covers: ["street"],
      images: ["hiroshima-okonomiyaki", "dotonbori-takoyaki"],
      places: ["dotonbori", "peace-memorial-park"],
      status: "fact-checked",
    },
    {
      id: "food-table",
      heading: "At the table",
      body: [
        "A meal begins and ends with thanks: itadakimasu before eating, gochisōsama after. Soup comes in a lacquered wooden bowl, which can be lifted in the hand because wood does not pass on the heat. Children learn how to hold chopsticks and bowls at the family table, which is where the cooking itself is passed on.",
        "The season is supposed to be visible. Dishes use what is in season, and the plates, the garnish and the flowers in the room’s alcove are chosen to match.",
      ],
      cite: ["maff-washoku", "unesco-washoku"],
      covers: ["customs"],
      status: "fact-checked",
    },
    {
      id: "food-feasts",
      heading: "Food for the new year, and for the gods",
      body: [
        "New Year is the great food occasion. Families welcome the deity of the year with a decoration at the door called kadomatsu, pound rice into cakes, and sit down to osechi, a set of dishes in stacked boxes in which each item is a wish: sweet black soybeans for health, herring roe for many descendants, small dried sardines for a good harvest. With it come ozōni and otoso, rice wine for the New Year.",
        "Food ties communities together through the rest of the year. After a rite at a shrine, people eat and drink what was offered to the kami, sake included, in a meal called naorai. In autumn, friends and neighbours in Yamagata and Miyagi gather by rivers to cook taro in a large pot. Yamagata’s inland version uses beef and soy sauce, Miyagi’s pork and miso.",
      ],
      cite: ["maff-washoku", "unesco-washoku"],
      covers: ["festivals"],
      status: "fact-checked",
    },
  ],
  status: "fact-checked",
};
