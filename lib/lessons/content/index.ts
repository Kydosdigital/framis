import type { LessonData } from "../types";
import lesson01 from "./lesson-01";
import lesson01_2 from "./lesson-01-2";
import lesson01_3 from "./lesson-01-3";
import lesson01_4 from "./lesson-01-4";
import lesson01_5 from "./lesson-01-5";
import lesson02_2 from "./lesson-02-2";
import lesson02_3 from "./lesson-02-3";
import lesson02_4 from "./lesson-02-4";
import lesson03 from "./lesson-03";
import lesson03_2 from "./lesson-03-2";
import lesson03_3 from "./lesson-03-3";
import lesson03_4 from "./lesson-03-4";
import lesson04 from "./lesson-04";
import lesson04_2 from "./lesson-04-2";
import lesson04_3 from "./lesson-04-3";
import lesson04_4 from "./lesson-04-4";
import lesson05 from "./lesson-05";
import lesson05_2 from "./lesson-05-2";
import lesson05_3 from "./lesson-05-3";
import lesson05_4 from "./lesson-05-4";
import lesson06 from "./lesson-06";
import lesson06_2 from "./lesson-06-2";
import lesson06_3 from "./lesson-06-3";
import lesson06_4 from "./lesson-06-4";
import lesson07 from "./lesson-07";
import lesson07_2 from "./lesson-07-2";
import lesson07_3 from "./lesson-07-3";
import lesson07_4 from "./lesson-07-4";
import lesson08 from "./lesson-08";
import lesson08_2 from "./lesson-08-2";
import lesson08_3 from "./lesson-08-3";
import lesson08_4 from "./lesson-08-4";
import lesson09 from "./lesson-09";
import lesson09_2 from "./lesson-09-2";
import lesson09_3 from "./lesson-09-3";
import lesson09_4 from "./lesson-09-4";
import lesson09_5 from "./lesson-09-5";
import lesson10 from "./lesson-10";
import lesson10_2 from "./lesson-10-2";
import lesson10_3 from "./lesson-10-3";
import lesson10_4 from "./lesson-10-4";
import lesson11 from "./lesson-11";
import lesson11_2 from "./lesson-11-2";
import lesson11_3 from "./lesson-11-3";
import lesson11_4 from "./lesson-11-4";
import lesson11_5 from "./lesson-11-5";
import lesson11_6 from "./lesson-11-6";
import lesson11_7 from "./lesson-11-7";
import lesson12 from "./lesson-12";
import lesson12_2 from "./lesson-12-2";
import lesson12_3 from "./lesson-12-3";
import lesson12_4 from "./lesson-12-4";
import lesson13 from "./lesson-13";
import lesson13_2 from "./lesson-13-2";
import lesson13_3 from "./lesson-13-3";
import lesson13_4 from "./lesson-13-4";
import lesson14_2 from "./lesson-14-2";
import lesson14_3 from "./lesson-14-3";
import lesson14_4 from "./lesson-14-4";
import lesson15 from "./lesson-15";
import lesson15_2 from "./lesson-15-2";
import lesson15_3 from "./lesson-15-3";
import lesson15_4 from "./lesson-15-4";
import lesson15_5 from "./lesson-15-5";
import lesson15_6 from "./lesson-15-6";
import lesson16 from "./lesson-16";
import lesson16_2 from "./lesson-16-2";
import lesson16_3 from "./lesson-16-3";
import lesson16_4 from "./lesson-16-4";
import lesson17 from "./lesson-17";
import lesson17_2 from "./lesson-17-2";
import lesson17_3 from "./lesson-17-3";
import lesson17_4 from "./lesson-17-4";
import lesson17_5 from "./lesson-17-5";
import lesson18 from "./lesson-18";
import lesson18_2 from "./lesson-18-2";
import lesson18_3 from "./lesson-18-3";
import lesson18_4 from "./lesson-18-4";
import lesson19 from "./lesson-19";
import lesson19_2 from "./lesson-19-2";
import lesson19_3 from "./lesson-19-3";
import lesson19_4 from "./lesson-19-4";
import lesson19_5 from "./lesson-19-5";
import lesson20 from "./lesson-20";
import lesson20_2 from "./lesson-20-2";
import lesson20_3 from "./lesson-20-3";
import lesson20_4 from "./lesson-20-4";
import lesson21 from "./lesson-21";
import lesson21_2 from "./lesson-21-2";
import lesson21_3 from "./lesson-21-3";
import lesson21_4 from "./lesson-21-4";
import lesson22 from "./lesson-22";
import lesson22_2 from "./lesson-22-2";
import lesson22_3 from "./lesson-22-3";
import lesson22_4 from "./lesson-22-4";
import lesson22_5 from "./lesson-22-5";
import lesson22_6 from "./lesson-22-6";
import lesson23 from "./lesson-23";
import lesson23_2 from "./lesson-23-2";
import lesson23_3 from "./lesson-23-3";
import lesson23_4 from "./lesson-23-4";
import lesson23_5 from "./lesson-23-5";
import lesson23_6 from "./lesson-23-6";
import lesson24 from "./lesson-24";
import lesson24_2 from "./lesson-24-2";
import lesson24_3 from "./lesson-24-3";
import lesson24_4 from "./lesson-24-4";

export const GENERIC_LESSONS: Record<number, LessonData[]> = {
  1: [lesson01, lesson01_2, lesson01_3, lesson01_4, lesson01_5],
  2: [lesson02_2, lesson02_3, lesson02_4],
  3: [lesson03, lesson03_2, lesson03_3, lesson03_4],
  4: [lesson04, lesson04_2, lesson04_3, lesson04_4],
  5: [lesson05, lesson05_2, lesson05_3, lesson05_4],
  6: [lesson06, lesson06_2, lesson06_3, lesson06_4],
  7: [lesson07, lesson07_2, lesson07_3, lesson07_4],
  8: [lesson08, lesson08_2, lesson08_3, lesson08_4],
  9: [lesson09, lesson09_2, lesson09_3, lesson09_4, lesson09_5],
  10: [lesson10, lesson10_2, lesson10_3, lesson10_4],
  11: [lesson11, lesson11_2, lesson11_3, lesson11_4, lesson11_5, lesson11_6, lesson11_7],
  12: [lesson12, lesson12_2, lesson12_3, lesson12_4],
  13: [lesson13, lesson13_2, lesson13_3, lesson13_4],
  14: [lesson14_2, lesson14_3, lesson14_4],
  15: [lesson15, lesson15_2, lesson15_3, lesson15_4, lesson15_5, lesson15_6],
  16: [lesson16, lesson16_2, lesson16_3, lesson16_4],
  17: [lesson17, lesson17_2, lesson17_3, lesson17_4, lesson17_5],
  18: [lesson18, lesson18_2, lesson18_3, lesson18_4],
  19: [lesson19, lesson19_2, lesson19_3, lesson19_4, lesson19_5],
  20: [lesson20, lesson20_2, lesson20_3, lesson20_4],
  21: [lesson21, lesson21_2, lesson21_3, lesson21_4],
  22: [lesson22, lesson22_2, lesson22_3, lesson22_4, lesson22_5, lesson22_6],
  23: [lesson23, lesson23_2, lesson23_3, lesson23_4, lesson23_5, lesson23_6],
  24: [lesson24, lesson24_2, lesson24_3, lesson24_4],
};
