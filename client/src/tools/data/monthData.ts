export const monthByDate = {
  1: { month: "January", abb: "Jan", days: 31, dayOfYear: 1 },
  32: { month: "February", abb: "Feb", days: 28, dayOfYear: 32 },
  60: { month: "March", abb: "Mar", days: 31, dayOfYear: 60 },
  91: { month: "April", abb: "Apr", days: 30, dayOfYear: 91 },
  121: { month: "May", abb: "May", days: 31, dayOfYear: 121 },
  152: { month: "June", abb: "Jun", days: 30, dayOfYear: 152 },
  182: { month: "July", abb: "Jul", days: 31, dayOfYear: 182 },
  213: { month: "August", abb: "Aug", days: 31, dayOfYear: 213 },
  244: { month: "September", abb: "Sep", days: 30, dayOfYear: 244 },
  274: { month: "October", abb: "Oct", days: 31, dayOfYear: 274 },
  305: { month: "November", abb: "Nov", days: 30, dayOfYear: 305 },
  335: { month: "December", abb: "Dec", days: 31, dayOfYear: 335 },
};

export const monthByIndex = {
  1: monthByDate[1],
  2: monthByDate[32],
  3: monthByDate[60],
  4: monthByDate[91],
  5: monthByDate[121],
  6: monthByDate[152],
  7: monthByDate[182],
  8: monthByDate[213],
  9: monthByDate[244],
  10: monthByDate[274],
  11: monthByDate[305],
  12: monthByDate[335],
};
