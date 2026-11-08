// Scheduling rules, written without any Arduino code so they can be tested on a computer.
// Used by servo_control.ino to decide whether a scheduled dose is due.
#pragma once
#include <string.h>

// Minutes since midnight for "HH:MM", or -1 if the text is not a valid time.
inline int parseHHMM(const char* s) {
  if (!s || strlen(s) != 5 || s[2] != ':') return -1;
  if (s[0] < '0' || s[0] > '9' || s[1] < '0' || s[1] > '9' || s[3] < '0' || s[3] > '9' || s[4] < '0' || s[4] > '9') return -1;
  int h = (s[0] - '0') * 10 + (s[1] - '0');
  int m = (s[3] - '0') * 10 + (s[4] - '0');
  if (h > 23 || m > 59) return -1;
  return h * 60 + m;
}

// The app counts weekdays Monday = 0 ... Sunday = 6. struct tm counts Sunday = 0 ... Saturday = 6.
inline int appWeekday(int tmWday) { return (tmWday + 6) % 7; }

// Is that weekday (app numbering) switched on in the bitmask? Monday is bit 0, Sunday is bit 6.
inline bool dayInMask(int mask, int appDay) { return appDay >= 0 && appDay <= 6 && ((mask >> appDay) & 1); }

// A medicine on a break stays off until pausedUntil ("YYYY-MM-DD"): paused while today is before that date.
// Empty text means no break.
inline bool isPausedOn(const char* todayIso, const char* pausedUntil) {
  return pausedUntil && pausedUntil[0] && strcmp(todayIso, pausedUntil) < 0;
}

enum SlotTiming { SLOT_NOT_YET, SLOT_DUE, SLOT_LATE };

// Is a dose at dueMin due now? "Due" means from its time up to windowMin minutes after it.
// Anything later than that is LATE and is skipped, never dispensed.
inline SlotTiming slotTiming(int nowMin, int dueMin, int windowMin) {
  if (nowMin < dueMin) return SLOT_NOT_YET;
  if (nowMin - dueMin <= windowMin) return SLOT_DUE;
  return SLOT_LATE;
}

// One compartment's schedule, as read from Firebase.
struct ScheduleEntry {
  bool used;             // false if nothing is scheduled for this compartment
  bool manual;           // as-needed medicine: never dispensed automatically
  int days;              // bitmask of the days switched on: Monday is bit 0 ... Sunday is bit 6
  char times[48];        // "08:00,20:00"
  char pausedUntil[11];  // "YYYY-MM-DD" while on a break, otherwise ""
};

// Copies the n-th time (counting from 0) out of a list like "08:00,20:00" into out, which needs 6 characters.
// Returns false when the list has no n-th time.
inline bool nthTime(const char* list, int n, char* out) {
  if (!list) return false;
  int index = 0;
  const char* start = list;
  while (true) {
    const char* comma = strchr(start, ',');
    size_t len = comma ? (size_t)(comma - start) : strlen(start);
    if (index == n) {
      if (len == 0 || len > 5) return false;
      memcpy(out, start, len);
      out[len] = '\0';
      return true;
    }
    if (!comma) return false;
    start = comma + 1;
    index++;
  }
}

// Should this compartment's medicine be dispensed today? It must be scheduled, not "manual",
// switched on for today's weekday (app numbering), and not on a break.
inline bool entryDueToday(const ScheduleEntry& e, const char* todayIso, int appDay) {
  return e.used && !e.manual && dayInMask(e.days, appDay) && !isPausedOn(todayIso, e.pausedUntil);
}

// Does this compartment's medicine have a dose at hhmm ("08:00")?
inline bool entryHasTime(const ScheduleEntry& e, const char* hhmm) {
  char t[6];
  for (int k = 0; nthTime(e.times, k, t); k++) {
    if (strcmp(t, hhmm) == 0) return true;
  }
  return false;
}

// Lists every distinct valid time today that has at least one pill due, earliest first.
// Fills outText ("08:00") and outMin (minutes since midnight), and returns how many it found (at most maxOut).
inline int gatherSlots(const ScheduleEntry* sched, int n, const char* todayIso, int appDay, char (*outText)[6], int* outMin, int maxOut) {
  int count = 0;
  for (int c = 0; c < n; c++) {
    if (!entryDueToday(sched[c], todayIso, appDay)) continue;
    char tt[6];
    for (int k = 0; nthTime(sched[c].times, k, tt); k++) {
      int m = parseHHMM(tt);
      if (m < 0) continue;
      bool known = false;
      for (int j = 0; j < count; j++) if (outMin[j] == m) known = true;
      if (!known && count < maxOut) {
        strcpy(outText[count], tt);
        outMin[count] = m;
        count++;
      }
    }
  }
  for (int a = 1; a < count; a++) {        // sort by time (a tiny list, so a simple insertion sort)
    for (int b = a; b > 0 && outMin[b - 1] > outMin[b]; b--) {
      int tmpMin = outMin[b]; outMin[b] = outMin[b - 1]; outMin[b - 1] = tmpMin;
      char tmpText[6]; strcpy(tmpText, outText[b]); strcpy(outText[b], outText[b - 1]); strcpy(outText[b - 1], tmpText);
    }
  }
  return count;
}
