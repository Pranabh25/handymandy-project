import type { ReviewStatus } from "../../src/generated/prisma/enums";

type R = [rating: number, title: string, body: string];

export const reviewerNames = [
  "Priya Nair", "Rohan Mehta", "Kavya Reddy", "Aditya Kulkarni", "Sneha Iyer", "Arjun Malhotra",
  "Divya Menon", "Karthik Subramanian", "Neha Agarwal", "Vikram Singh", "Pooja Deshpande", "Siddharth Rao",
  "Aishwarya Pillai", "Rahul Verma", "Meghna Banerjee", "Ishaan Chopra", "Tanvi Joshi", "Nikhil Gupta",
  "Shruti Hegde", "Aman Khanna", "Riya Chatterjee", "Varun Bhat", "Lakshmi Krishnan", "Harsh Patel",
  "Swati Mishra", "Abhishek Sinha", "Nandini Das", "Gaurav Saxena", "Anjali Thakur", "Manish Jain",
  "Deepika Shetty", "Sameer Qureshi", "Bhavna Trivedi", "Rajat Arora", "Madhuri Kamath", "Pranav Mohanty",
  "Zoya Siddiqui", "Kunal Bose", "Revathi Sundaram", "Aarti Pandey", "Tejas Naik", "Farah Khan",
  "Suresh Venkatesh", "Ira Bhattacharya", "Jaspreet Kaur", "Mohit Rawat", "Sonal Shah", "Vivek Rathore",
];

export const reviewerCities = [
  "Mumbai", "Pune", "Jaipur", "Kochi", "Lucknow", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad",
  "Chandigarh", "Indore", "Bhubaneswar", "Bengaluru", "New Delhi", "Gurugram", "Nagpur", "Coimbatore",
  "Mysuru", "Vadodara", "Dehradun", "Surat", "Thiruvananthapuram", "Guwahati", "Bhopal",
];

/** Category-level reviews used to fill each product's review list. */
const categoryPool: Record<string, R[]> = {
  "gift-hampers": [
    [5, "Packaging was stunning", "The basket arrived wrapped in tissue with a wax seal and the handwritten note was a lovely touch. My in-laws were genuinely touched."],
    [5, "Perfect Diwali gift for the office", "Ordered twelve for my team. All arrived on the same day, nothing damaged, and everyone asked where they were from."],
    [4, "Lovely, but delivery took a day extra", "Everything inside was good quality and well chosen. Delivery to Kochi took six days instead of five, but support kept me updated on WhatsApp."],
    [5, "Feels much more premium than the price", "Rigid box, fabric ribbon and each item individually wrapped. It looked like something from a luxury store."],
    [4, "Good selection of products", "Liked most of the items. The candle smells gorgeous. Would have loved a slightly bigger basket for the price."],
    [5, "My sister loved it", "Sent it to Pune for her birthday. She called me the moment she opened it — the note was written exactly as I typed it."],
    [3, "Nice, but one jar was loose", "The hamper itself is pretty. One of the jars had come loose inside the box, though nothing broke. Customer care offered a replacement immediately."],
    [5, "Will order again", "Second time ordering a hamper from LushAura and the quality is consistent. Great for last-minute gifting too."],
    [4, "Thoughtful and useful", "Not the usual random items — everything in it actually gets used. The packaging is reusable as well."],
    [5, "Arrived just in time", "Placed the order on a Tuesday and it reached Hyderabad by Friday, right before the housewarming. Beautifully packed."],
  ],
  "personalised-gifts": [
    [5, "Engraving is crisp and neat", "I was worried about spelling mistakes but they got it perfect. The engraving is deep and even."],
    [5, "A gift they'll keep forever", "Gave this for my parents' 30th anniversary. My mother has put it right in the living room."],
    [4, "Took 4 days but worth it", "Personalisation added a few days to delivery, which they did mention upfront. Quality is excellent."],
    [5, "Looks even better in person", "The photos don't do it justice. Solid, well-finished and the lettering is beautiful."],
    [4, "Lovely, packaging could be sturdier", "The product is lovely. The outer box was slightly dented when it arrived but the item was safe inside the foam."],
    [5, "Very personal gift", "My husband loved seeing his name on it. Such a simple idea but it feels very special."],
    [3, "Good, font options are limited", "The finish is great but I wish there were a few more font options. Still a nice gift."],
    [5, "Support helped me with the text", "I wasn't sure how to fit both names — the team called me to confirm the layout before making it. Great service."],
  ],
  "festive-gifts": [
    [5, "Made our Diwali special", "Used these for Lakshmi pooja and everyone complimented the look. Genuinely handcrafted, you can tell."],
    [5, "Beautiful craftsmanship", "The detailing is gorgeous. Love that it supports artisans too."],
    [4, "Nice quality, well packed", "Came in bubble wrap and a sturdy carton, nothing broken. Colours are slightly different from the photos but still lovely."],
    [5, "Gifted to all my relatives", "Bought several sets for family. Great value and it looks far more expensive than it is."],
    [4, "Good, arrived a little late", "Product is lovely. Delivery to Bhubaneswar took a week during the festive rush, so order early."],
    [3, "Decent", "It's nice but a bit smaller than I expected. Check the dimensions before ordering."],
    [5, "Traditional yet modern", "Exactly the kind of festive décor I was looking for — not too flashy, very elegant."],
    [5, "Reusable and pretty", "Using it again for every festival. The quality has held up really well."],
  ],
  "home-fragrance": [
    [5, "Fills the whole room", "Lit it for thirty minutes and the whole living room smelt beautiful. Very clean burn, no black soot."],
    [5, "Smells expensive", "Friends keep asking which brand it is. The fragrance is rich but not headache-inducing."],
    [4, "Lovely but subtle", "Fragrance is gorgeous up close. In a big hall it's a little subtle, but perfect for a bedroom."],
    [5, "My new favourite scent", "Reminds me of my grandmother's house. Already ordered a second one."],
    [4, "Great gift item", "Packaging is premium and it makes a great housewarming gift. Wish it lasted a bit longer."],
    [5, "Calming evenings", "I use it every evening while reading. It's become part of my wind-down ritual."],
    [3, "Nice, throw is light", "The scent is pleasant but I expected it to be stronger. Works well in smaller spaces."],
    [5, "Beautifully packed", "Arrived in a cushioned box with a thank-you card. The glass jar is lovely to reuse."],
  ],
  skincare: [
    [5, "Visible glow in two weeks", "I've been using it every night and my skin looks brighter and more even. My mother noticed before I did."],
    [4, "Good for humid weather", "Doesn't feel heavy even in Chennai humidity. Absorbs quickly and doesn't break me out."],
    [5, "Gentle on sensitive skin", "I react to most products but this caused zero irritation. Finally something that works for me."],
    [4, "Nice texture, mild fragrance", "Lovely texture. The natural herbal smell took a few days to get used to, but I like it now."],
    [5, "Worth every rupee", "A little goes a long way. My bottle has lasted nearly three months with daily use."],
    [3, "Okay for me", "It's pleasant to use but I haven't seen dramatic results yet. Will continue for another month before deciding."],
    [5, "Clean ingredients, real results", "Love that the full ingredient list is on the site. Skin feels softer and looks healthier."],
    [4, "Great, packaging is sturdy", "Came in a well-sealed box with a leak-proof cap. Product is good; results are gradual but real."],
    [5, "Part of my routine now", "Replaced two products in my routine with this. Skin feels balanced and calm."],
    [5, "Dermat approved", "Showed the ingredient list to my dermatologist and she said it's a good pick for my skin."],
  ],
  makeup: [
    [5, "Perfect shade for Indian skin", "Finally a shade that doesn't look grey on my wheatish skin. Looks natural and polished."],
    [4, "Long-lasting", "Stayed on through lunch and coffee. Needed a touch-up in the evening, which is fair."],
    [5, "Doesn't dry out lips", "Most mattes crack on me within an hour but this stays comfortable all day."],
    [4, "Lovely formula", "Glides on smoothly, pigmentation is great. The case feels premium too."],
    [5, "Wore it to a wedding", "Lasted through the sangeet and all the dancing. Got so many compliments."],
    [3, "Nice, but not for me", "The formula is good but the shade is a bit darker than it looks online. Would suit deeper skin tones better."],
    [5, "Everyday favourite", "This is the one I reach for every morning. Quick, easy and looks put-together."],
    [4, "Good value", "Comparable to much pricier options. Packaging was neat and came with a sample."],
    [5, "Clean and comfortable", "Love that it's vegan and paraben-free. No irritation at all."],
  ],
  fragrance: [
    [5, "Compliments all day", "Wore it to office and three people asked what I was wearing. Lasts from morning to evening."],
    [5, "Unique and very Indian", "It smells nothing like the usual department-store perfumes. Feels like a memory."],
    [4, "Beautiful, a bit strong at first", "The opening is intense but it settles into something gorgeous within ten minutes."],
    [5, "Bottle is stunning", "The flacon and wooden cap look beautiful on my dresser. The fragrance itself is lovely."],
    [4, "Good longevity", "Stays around six to seven hours on me. On clothes it lasts even longer."],
    [5, "Gifted to my husband", "He's very particular about perfume and he loves this one. Now wears it daily."],
    [3, "Nice, not my style", "Well-made fragrance but a bit too woody for my taste. My brother has taken it over."],
    [5, "Safe delivery", "Arrived double-boxed and sealed. No leakage at all even though it travelled to Guwahati."],
  ],
  "bath-body": [
    [5, "My skin loves this", "My elbows and heels have never been this soft. A little goes a long way."],
    [5, "Smells heavenly", "The scent is subtle and natural. My whole bathroom smells lovely."],
    [4, "Good for winter", "Perfect for Chandigarh winters. A little rich for summer, but I use less then."],
    [5, "Whole family uses it", "Even my kids and my father use it. No harsh chemicals, which is what I wanted."],
    [4, "Nice product, simple packaging", "Works really well. The packaging is minimal and eco-friendly, which I appreciate."],
    [3, "Decent", "It's good, but I didn't notice a huge difference from what I was using earlier."],
    [5, "Reminds me of home", "Feels like the homemade remedies my nani used to make, but more convenient."],
    [5, "Repeat purchase", "This is my third order. Consistent quality every time and quick delivery to Pune."],
  ],
};

/** A couple of product-specific reviews so each page reads authentically. */
const productSpecific: Record<string, R[]> = {
  "diwali-diya-dry-fruit-hamper": [[5, "The dry fruits were so fresh", "Crunchy almonds, big cashews and the diyas are hand-painted beautifully. The cane basket is now my fruit basket."]],
  "corporate-thank-you-hamper": [[5, "Our clients loved it", "Sent 40 of these to clients before Diwali. The team handled bulk addresses smoothly and every box arrived on time."]],
  "rakhi-self-care-hamper": [[5, "Better than the usual mithai", "My brother lives in Bengaluru and my sister-in-law ended up using the toner! The rakhi was really pretty."], [4, "Lovely, but arrived a day late", "Everything inside was beautifully packed and the rakhi was elegant. Courier took an extra day, so plan ahead for Raksha Bandhan."]],
  "wedding-trousseau-beauty-box": [[5, "Bride-to-be was thrilled", "Gifted this to my cousin a month before her wedding. The wooden box alone is gorgeous and she's using every product."]],
  "housewarming-brass-bloom-hamper": [[5, "Griha pravesh gift sorted", "The brass urli is heavy and well made. The mogra diffuser is still going strong after a month."]],
  "new-mom-pamper-hamper": [[5, "So thoughtful", "My friend just had a baby and said this was the only gift that was actually for her. The mulmul stole is so soft."]],
  "personalised-brass-name-diya": [[5, "Lit it for our first Diwali", "Got our family name engraved for our first Diwali in the new house. It's heavy, solid brass and glows beautifully."]],
  "engraved-sheesham-keepsake-box": [[5, "Keeping our wedding cards in it", "The wood grain is beautiful and the velvet lining is a lovely surprise. Engraving is perfectly centred."]],
  "monogrammed-vegan-leather-travel-pouch": [[4, "Great travel companion", "Fits my skincare and charger perfectly. The gold foil initials look classy. Wish it had one more inner pocket."]],
  "custom-couple-name-candle": [[5, "Anniversary surprise", "Our names and wedding date were hand-lettered so neatly. The rose-oud scent is romantic without being too sweet."]],
  "hand-painted-terracotta-diya-set": [[5, "Truly handmade", "Each diya is slightly different, which I love. The mirror-work painting is so pretty."]],
  "rakhi-thali-gift-set": [[4, "Pretty thali", "The German-silver thali has a lovely paisley border. The rakhis were a bit simple, but the thali makes up for it."]],
  "festive-mithai-tin-box": [[5, "Kaju katli was melt-in-mouth", "Tasted like it came straight from a sweet shop in Indore. The illustrated tin is too pretty to throw away."]],
  "brass-urli-floating-candle-set": [[5, "Stunning centrepiece", "Filled it with marigold petals and the floating candles for Diwali. Everyone stopped to take photos."]],
  "saffron-sandalwood-soy-candle": [[5, "Signature scent indeed", "Warm, cosy and elegant. I burn it every evening and it's lasted over five weeks already."]],
  "mogra-jasmine-reed-diffuser": [[5, "Smells like fresh gajra", "It genuinely smells like fresh mogra, not artificial at all. Keeps my entryway smelling lovely."]],
  "vetiver-khus-room-mist": [[4, "Cooling and calming", "Spray it on my pillow before sleeping. The khus smell takes me right back to childhood summers."]],
  "temple-dhoop-cone-gift-box": [[4, "Low smoke as promised", "Much less smoke than regular dhoop and the loban is my favourite. Brass holder is a nice bonus."]],
  "kumkumadi-radiance-face-oil": [
    [5, "My pigmentation has faded", "Six weeks in and the dark spots on my cheeks are noticeably lighter. Doesn't feel greasy at all."],
    [5, "Holy grail face oil", "I've tried many kumkumadi oils and this is the most authentic — the saffron fragrance is real."],
  ],
  "ubtan-brightening-face-pack": [[5, "Just like my mother's ubtan", "Mixed it with curd and my tan from the Goa trip faded after three uses. No yellow stains either."]],
  "niacinamide-rice-water-serum": [[5, "Pores look smaller", "My T-zone stays matte till lunch now. Light enough to use under sunscreen every day."], [4, "Works well, took a few weeks", "Needed about four weeks to see a difference in my pores, but it absorbs quickly and doesn't pill under makeup."]],
  "vitamin-c-amla-day-cream": [[4, "Nice glow, no white cast", "Gives a lovely dewy finish and no white cast on my medium skin. I layer sunscreen on top for outdoors."]],
  "bakuchiol-night-renewal-cream": [[5, "Retinol without the peeling", "Retinol always made me flaky, but this is so gentle. Skin looks smoother after a month."]],
  "rose-water-hydrating-toner": [[5, "Real gulab jal", "You can smell that it's proper Kannauj rose water. I keep one at work and one at home."]],
  "saffron-under-eye-gel": [[4, "Great for puffy mornings", "The metal tip is so cooling. Puffiness goes down quickly; dark circles are slowly getting lighter."]],
  "matte-lipstick-terracotta-nude": [
    [5, "The perfect brown nude", "I've searched for years for a nude that doesn't make me look washed out. This is it."],
    [5, "Bought a backup", "Liked it so much I bought a second one. Pairs beautifully with the kajal."],
  ],
  "matte-lipstick-gulmohar-red": [[5, "The perfect wedding red", "Wore it for my friend's reception and it didn't budge through dinner. Makes teeth look whiter too."]],
  "smudge-proof-kajal-midnight-black": [[5, "Actually smudge-proof", "Survived a full day in Mumbai humidity and a rainy commute. Deep black in one swipe."]],
  "lip-cheek-tint-pomegranate": [[4, "Natural flush", "Gives the prettiest berry flush on my cheeks. On lips it's quite sheer, which I like for daytime."]],
  "dewy-skin-tint-warm-honey": [[4, "Skin but better", "Warm Honey matched my medium skin well. Coverage is light, so I spot-conceal where needed."]],
  "vetiver-oud-eau-de-parfum": [[5, "Smoky and sophisticated", "One spray in the morning and I can still smell it at night. The oud is rich but not overpowering."]],
  "mogra-musk-eau-de-parfum": [[5, "Wore it on my wedding day", "Felt like wearing a gajra without the flowers. My husband now associates this smell with our wedding."]],
  "sandalwood-attar-roll-on": [[5, "Authentic Kannauj attar", "Creamy, milky sandalwood that lasts all day. Reminds me of my grandfather's attar collection."]],
  "monsoon-mitti-eau-de-toilette": [[5, "It really smells like rain", "Closed my eyes after spraying and it felt like the first monsoon shower. So unique."]],
  "kokum-butter-body-balm": [[5, "Cracked heels healed", "Applied it every night with socks and my heels are smooth in a week. Melts beautifully."]],
  "rose-hibiscus-hair-oil": [[5, "Hair fall has reduced", "Using it twice a week for two months and I see much less hair on my comb. Smells lovely too."]],
  "sandalwood-haldi-bathing-bars": [[4, "Lovely handmade soap", "Lathers nicely and doesn't dry my skin. Each bar lasts almost a month."]],
  "coffee-coconut-body-scrub": [[5, "Smells like a Coorg estate", "The coffee smell is amazing and my skin feels so smooth after. Doesn't leave a mess in the shower."]],
};

export type SeedReview = {
  productSlug: string;
  authorName: string;
  city: string;
  rating: number;
  title: string;
  body: string;
  isVerified: boolean;
  status: ReviewStatus;
  daysAgo: number;
};

/** Deterministically builds 3–8 approved reviews per product. */
export function buildApprovedReviews(products: { slug: string; categorySlug: string }[]): SeedReview[] {
  const out: SeedReview[] = [];
  const catCursor: Record<string, number> = {};
  products.forEach((p, i) => {
    const target = 3 + ((i * 5 + 3) % 6); // 3..8
    const specific = productSpecific[p.slug] ?? [];
    const pool = categoryPool[p.categorySlug];
    const picks: R[] = [...specific];
    let cursor = catCursor[p.categorySlug] ?? 0;
    while (picks.length < target) {
      picks.push(pool[cursor % pool.length]);
      cursor += 1;
    }
    catCursor[p.categorySlug] = cursor;
    picks.forEach(([rating, title, body], j) => {
      const n = i * 7 + j * 3;
      out.push({
        productSlug: p.slug,
        authorName: reviewerNames[n % reviewerNames.length],
        city: reviewerCities[(i * 3 + j * 5) % reviewerCities.length],
        rating,
        title,
        body,
        isVerified: (i + j) % 6 !== 5,
        status: "APPROVED",
        daysAgo: 4 + ((i * 17 + j * 29) % 176),
      });
    });
  });
  return out;
}

/** Moderation queue demo: 6 pending + 2 rejected. */
export const moderationReviews: SeedReview[] = [
  { productSlug: "kumkumadi-radiance-face-oil", authorName: "Ritu Saxena", city: "Lucknow", rating: 5, title: "Glowing skin before Karva Chauth", body: "Started using it three weeks before Karva Chauth and my skin was glowing on the day. Will definitely repurchase.", isVerified: true, status: "PENDING", daysAgo: 1 },
  { productSlug: "diwali-diya-dry-fruit-hamper", authorName: "Anand Krishnamurthy", city: "Chennai", rating: 4, title: "Good hamper, cane basket is lovely", body: "Ordered for my uncle. Everything was fresh and well packed. The candle could have been a little bigger.", isVerified: true, status: "PENDING", daysAgo: 2 },
  { productSlug: "matte-lipstick-terracotta-nude", authorName: "Simran Bedi", city: "Chandigarh", rating: 3, title: "Pretty shade, slightly drying", body: "The colour is beautiful on me but I need a lip balm underneath after a few hours. Otherwise lovely.", isVerified: true, status: "PENDING", daysAgo: 2 },
  { productSlug: "saffron-sandalwood-soy-candle", authorName: "Keerthana Raju", city: "Coimbatore", rating: 5, title: "Gifted three of these", body: "Bought one for myself and ended up ordering three more as gifts. Everyone loved the fragrance.", isVerified: false, status: "PENDING", daysAgo: 3 },
  { productSlug: "personalised-brass-name-diya", authorName: "Sanjay Deshmukh", city: "Nagpur", rating: 4, title: "Engraving is neat", body: "The engraving came out well. Delivery took five days, which was fine since they mentioned it upfront.", isVerified: true, status: "PENDING", daysAgo: 4 },
  { productSlug: "rose-hibiscus-hair-oil", authorName: "Nisha Varghese", city: "Kochi", rating: 5, title: "Reminds me of Kerala champi", body: "Very similar to the hibiscus oil my ammachi made. Hair feels soft and shiny after every wash.", isVerified: true, status: "PENDING", daysAgo: 5 },
  { productSlug: "vetiver-oud-eau-de-parfum", authorName: "Wholesale Deals India", city: "Delhi", rating: 5, title: "Best price bulk perfume", body: "We supply perfumes in bulk at lowest rates, WhatsApp us for catalogue and dealer pricing.", isVerified: false, status: "REJECTED", daysAgo: 18 },
  { productSlug: "ubtan-brightening-face-pack", authorName: "Rakesh K", city: "Mumbai", rating: 1, title: "Courier was rude", body: "The delivery person was rude and did not wait. Haven't used the product yet.", isVerified: false, status: "REJECTED", daysAgo: 26 },
];
