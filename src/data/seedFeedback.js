const HOUR = 60
const DAY = 24 * HOUR

const ROWS = [
  {
    name: 'Priya Sharma',
    subject: 'Order arrived with missing items',
    message:
      "My delivery arrived this morning but several of the items I ordered were missing. I've been charged for everything and I'm not sure how to get a refund. This is really frustrating as I needed these items for dinner tonight.",
    minutesAgo: 18,
    channel: 'email',
    order: '7894221',
  },
  {
    name: 'James Riley',
    subject: 'Substitution not suitable',
    message:
      'The substitute items I received were not suitable for my dietary requirements. I specifically ordered organic oat milk and was given regular dairy milk instead. I have ticked "no substitutions" for allergy items before - is that setting not working?',
    minutesAgo: 1 * HOUR + 42,
    channel: 'app',
    order: '7894218',
  },
  {
    name: 'Emma Harris',
    subject: 'Great delivery experience',
    message:
      'The delivery driver was really helpful and brought everything inside when he saw I had a baby on my hip. Excellent service, please pass on my thanks to Dan!',
    minutesAgo: 2 * HOUR + 25,
    channel: 'web_form',
    order: '7894215',
    status: 'in_progress',
    sentiment: 'positive',
    category: 'delivery',
  },
  {
    name: 'Olu Adeyemi',
    subject: 'Driver left bags in the rain',
    message:
      'Bags were left outside my front door in the pouring rain without anyone ringing the bell. The paper bags had split and the bread is soaked. I was home the entire time.',
    minutesAgo: 3 * HOUR + 5,
    channel: 'app',
    order: '7894207',
  },
  {
    name: 'Hannah Clarke',
    subject: 'Cannot apply my voucher code',
    message:
      'I have a £10 off voucher from your email campaign but checkout says it is invalid. It expires tomorrow and my basket is well over the minimum spend. Could someone please look into this?',
    minutesAgo: 4 * HOUR + 50,
    channel: 'email',
    order: null,
  },
  {
    name: 'Michael Khan',
    subject: 'Refund still not received',
    message:
      "I was told I would receive a refund for the damaged items on my last order but it still hasn't appeared in my account after 10 days. I've contacted you twice already.",
    minutesAgo: 1 * DAY + 2 * HOUR,
    channel: 'email',
    order: '7894189',
    sentiment: 'negative',
    category: 'refund',
  },
  {
    name: 'Laura Taylor',
    subject: 'Damaged product on delivery',
    message:
      "The milk arrived damaged and leaked all over the other items. Several items were ruined including a birthday cake I had ordered for my son's party.",
    minutesAgo: 1 * DAY + 5 * HOUR,
    channel: 'web_form',
    order: '7894181',
    status: 'in_progress',
    sentiment: 'negative',
    category: 'product_quality',
    note: 'Called customer - refund for milk + cake approved, awaiting finance.',
  },
  {
    name: 'Tom Whitaker',
    subject: 'Love the new rewards scheme',
    message:
      'Just wanted to say the new Smart Pass perks are brilliant. Free delivery plus the monthly treats have made me switch fully from my old supermarket.',
    minutesAgo: 1 * DAY + 7 * HOUR,
    channel: 'app',
    order: null,
  },
  {
    name: 'Grace Okafor',
    subject: 'App not working for delivery slot',
    message:
      'I have been trying to book a delivery slot for Saturday but the app keeps crashing when I tap "Reserve". I\'ve reinstalled it twice. iPhone 15, latest iOS.',
    minutesAgo: 2 * DAY + 3 * HOUR,
    channel: 'app',
    order: null,
    sentiment: 'negative',
    category: 'app_website',
  },
  {
    name: 'Daniel Novak',
    subject: 'Short dated chicken',
    message:
      "Chicken breasts arrived with a use-by of today. I had planned meals for later in the week, so this isn't much use. Other items were fine.",
    minutesAgo: 2 * DAY + 6 * HOUR,
    channel: 'web_form',
    order: '7894102',
  },
  {
    name: 'Sophie Bennett',
    subject: 'Driver was early and polite',
    message:
      'Delivery came ten minutes early, driver texted ahead and was lovely. Everything was cold that should be cold. No complaints at all.',
    minutesAgo: 3 * DAY + 1 * HOUR,
    channel: 'app',
    order: '7894077',
    status: 'resolved',
    sentiment: 'positive',
    category: 'delivery',
  },
  {
    name: 'Ravi Patel',
    subject: 'Charged twice for one order',
    message:
      'My bank shows two payments of £84.20 for the same order. Please refund the duplicate charge as soon as possible - it has pushed my account into overdraft.',
    minutesAgo: 3 * DAY + 4 * HOUR,
    channel: 'phone',
    order: '7894069',
  },
  {
    name: 'Chloe Martin',
    subject: "Can't update my delivery address",
    message:
      "I have moved house and want to change my default address, but the save button is greyed out on the website. I don't want my next order going to the old flat.",
    minutesAgo: 4 * DAY + 2 * HOUR,
    channel: 'web_form',
    order: null,
    status: 'in_progress',
    sentiment: 'neutral',
    category: 'account',
  },
  {
    name: 'Ahmed Hussain',
    subject: 'Substitute was actually better',
    message:
      'Got a different brand of coffee as a substitute and honestly it was better than what I ordered. Might switch permanently! Good choice by the picker.',
    minutesAgo: 4 * DAY + 9 * HOUR,
    channel: 'app',
    order: '7894011',
    status: 'resolved',
    sentiment: 'positive',
    category: 'substitution',
  },
  {
    name: 'Isabel Moreno',
    subject: 'Frozen items had defrosted',
    message:
      'The ice cream and frozen peas were fully defrosted when they arrived. The driver said the van freezer had been playing up. I had to throw them away.',
    minutesAgo: 5 * DAY + 3 * HOUR,
    channel: 'email',
    order: '7893987',
  },
  {
    name: 'George Evans',
    subject: 'Question about bag recycling',
    message:
      "Do you still collect plastic bags back from customers for recycling? The driver wasn't sure and I've got a big pile building up.",
    minutesAgo: 6 * DAY + 1 * HOUR,
    channel: 'web_form',
    order: null,
    status: 'resolved',
    sentiment: 'neutral',
    category: 'other',
    note: 'Replied with bag return policy link.',
  },
  {
    name: 'Fatima Begum',
    subject: 'Missing halal items again',
    message:
      "Third week in a row the halal lamb has been missing from my order with no substitute offered. Is there a stock issue at the warehouse? I'd rather know before I plan meals.",
    minutesAgo: 6 * DAY + 8 * HOUR,
    channel: 'email',
    order: '7893940',
  },
  {
    name: 'Ben Thompson',
    subject: 'Delivery slot changed without notice',
    message:
      "My 7-8am slot was moved to 9-10am the night before with just a text. I had to leave for work so nobody was in. Now I'm being charged a missed delivery fee.",
    minutesAgo: 8 * DAY,
    channel: 'phone',
    order: '7893876',
    sentiment: 'negative',
    category: 'delivery',
  },
  {
    name: 'Nina Kowalski',
    subject: 'Password reset email never arrives',
    message:
      "I've requested a password reset five times today and the email never comes through. Checked spam too. I can't get into my account to place this week's shop.",
    minutesAgo: 9 * DAY + 4 * HOUR,
    channel: 'web_form',
    order: null,
    status: 'resolved',
    sentiment: 'negative',
    category: 'account',
  },
  {
    name: 'Oliver Grant',
    subject: 'Fruit quality has improved',
    message:
      'Noticed the avocados and berries have been much better quality over the last month. Whatever you changed, keep it up.',
    minutesAgo: 11 * DAY,
    channel: 'app',
    order: '7893790',
    status: 'resolved',
    sentiment: 'positive',
    category: 'product_quality',
  },
  {
    name: 'Yuki Tanaka',
    subject: 'Refund processed quickly',
    message:
      'Just confirming I received the refund for the broken eggs within a day. Thanks for sorting it so quickly, very impressed.',
    minutesAgo: 14 * DAY,
    channel: 'email',
    order: '7893655',
    status: 'resolved',
    sentiment: 'positive',
    category: 'refund',
  },
  {
    name: 'Kate Robinson',
    subject: 'Wrong product in my order',
    message:
      'I ordered gluten-free pasta and received regular pasta in the gluten-free packaging slot of the bag. My daughter is coeliac so this could have been serious.',
    minutesAgo: 18 * DAY,
    channel: 'phone',
    order: '7893502',
    status: 'in_progress',
    sentiment: 'negative',
    category: 'substitution',
  },
  {
    name: 'Sam Duffy',
    subject: 'Checkout keeps timing out',
    message:
      'Every time I get to payment the page spins and then says the session expired. Tried Chrome and Safari. Basket is saved at least.',
    minutesAgo: 24 * DAY,
    channel: 'web_form',
    order: null,
  },
  {
    name: 'Leah Fitzgerald',
    subject: 'Driver blocked my driveway',
    message:
      "Delivery was fine but the van blocked my neighbour's driveway for 20 minutes and they came round to complain to me. Minor, but thought you should know.",
    minutesAgo: 35 * DAY,
    channel: 'email',
    order: '7893111',
    status: 'resolved',
    sentiment: 'neutral',
    category: 'delivery',
  },
]

const slug = (name) => name.toLowerCase().replace(/[^a-z]+/g, '.')

export function buildSeedFeedback(now = new Date()) {
  return ROWS.map((row, index) => {
    const receivedAt = new Date(now.getTime() - row.minutesAgo * 60_000).toISOString()
    const classified = Boolean(row.sentiment || row.category)
    return {
      id: `ofb_${String(index + 1).padStart(4, '0')}`,
      customer: {
        id: `cus_${slug(row.name)}`,
        name: row.name,
        email: `${slug(row.name)}@gmail.com`,
      },
      orderNumber: row.order,
      channel: row.channel,
      subject: row.subject,
      message: row.message,
      receivedAt,
      triage: {
        status: row.status ?? 'new',
        sentiment: row.sentiment ?? null,
        category: row.category ?? null,
        classifiedBy: classified ? 'agent' : null,
        updatedAt: classified ? receivedAt : null,
      },
      notes: row.note ? [{ id: `note_${index}`, body: row.note, author: 'Alicia Hill', createdAt: receivedAt }] : [],
    }
  })
}
