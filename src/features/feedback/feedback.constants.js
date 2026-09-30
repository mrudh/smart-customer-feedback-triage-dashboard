import {
  CircleHelp,
  Mail,
  MessageSquareText,
  Package,
  Phone,
  Receipt,
  Repeat,
  Smartphone,
  Truck,
  UserRound,
} from 'lucide-react'

export const SENTIMENT_META = {
  negative: { label: 'Negative', dot: 'bg-red-600', pill: 'bg-red-50 text-red-800 ring-red-200' },
  neutral: { label: 'Neutral', dot: 'bg-amber-500', pill: 'bg-amber-50 text-amber-900 ring-amber-200' },
  positive: { label: 'Positive', dot: 'bg-green-600', pill: 'bg-green-50 text-green-800 ring-green-200' },
}

export const STATUS_META = {
  new: { label: 'New', dot: 'bg-brand-600', pill: 'bg-brand-50 text-brand-700 ring-brand-200' },
  in_progress: { label: 'In progress', dot: 'bg-sky-600', pill: 'bg-sky-50 text-sky-800 ring-sky-200' },
  resolved: { label: 'Resolved', dot: 'bg-emerald-600', pill: 'bg-emerald-50 text-emerald-800 ring-emerald-200' },
}

export const CATEGORY_META = {
  delivery: { label: 'Delivery', icon: Truck, description: 'Late, missing or mishandled deliveries' },
  product_quality: { label: 'Product quality', icon: Package, description: 'Damaged, expired or poor-quality items' },
  substitution: { label: 'Substitution', icon: Repeat, description: 'Unsuitable or unwanted substitutes' },
  refund: { label: 'Refund', icon: Receipt, description: 'Refunds, charges and billing' },
  account: { label: 'Account', icon: UserRound, description: 'Login, details, Smart Pass and vouchers' },
  app_website: { label: 'App & website', icon: Smartphone, description: 'Bugs, slots and checkout issues' },
  other: { label: 'Other', icon: CircleHelp, description: 'Anything else' },
}

export const CHANNEL_META = {
  email: { label: 'Email', icon: Mail },
  app: { label: 'App', icon: Smartphone },
  web_form: { label: 'Web form', icon: MessageSquareText },
  phone: { label: 'Phone', icon: Phone },
}

export const VIEW_META = {
  all: { label: 'Inbox', description: 'All customer feedback' },
  needs_triage: { label: 'Needs triage', description: 'Missing a sentiment or category' },
  priority: { label: 'Priority', description: 'Negative and still open' },
}

export const UNCLASSIFIED_LABEL = 'Not classified'
