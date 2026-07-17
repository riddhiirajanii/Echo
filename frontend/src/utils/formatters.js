// Pure Helper Functions - Formatters
/**
 * Converts a raw date string into a clean editorial format.
 * Example: "2026-06-16T12:00:00Z" -> "June 16, 2026"
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

/**
 * Maps GAD-7 scores to clinical anxiety bands and specific color states.
 */
export const getAnxietySeverity = (score) => {
  if (score <= 4) return { label: 'Minimal or Low', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
  if (score <= 9) return { label: 'Mild Tension', color: 'bg-amber-50 text-amber-700 border-amber-100' };
  if (score <= 14) return { label: 'Moderate Anxiety', color: 'bg-orange-50 text-orange-700 border-orange-100' };
  return { label: 'Severe Strain', color: 'bg-rose-50 text-rose-700 border-rose-100' };
};