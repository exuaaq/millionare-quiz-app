// ============================================
// KONSTANTE ZA IGRU "KO ŽELI BITI MILIONER?"
// ============================================

// Nagradni iznosi za svako pitanje (kao u originalnoj igri)
export const PRIZE_LADDER: number[] = [
  0, // Početak
  100, // Pitanje 1
  200, // Pitanje 2
  300, // Pitanje 3
  500, // Pitanje 4
  1000, // Pitanje 5 - SIGURNA SUMA
  2000, // Pitanje 6
  4000, // Pitanje 7
  8000, // Pitanje 8
  16000, // Pitanje 9
  32000, // Pitanje 10 - SIGURNA SUMA
  64000, // Pitanje 11
  125000, // Pitanje 12
  250000, // Pitanje 13
  500000, // Pitanje 14
  1000000, // Pitanje 15 - MILION!
]

// Sigurne sume (igrač ne može pasti ispod ovih)
export const SAFE_HAVENS: number[] = [0, 1000, 32000]
