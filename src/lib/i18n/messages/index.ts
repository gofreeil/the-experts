// מאחד את מילוני ההודעות. כל קובץ נושא (common, home, ...) מכיל he ו-en זה לצד זה,
// ו-`satisfies` בכל קובץ מבטיח שאין מפתח שקיים רק בשפה אחת.
// builder.ts לא נכלל כאן בכוונה: הוא גדול ונחוץ רק בבילדר הפרסומות, ולכן דפי הבילדר
// טוענים אותו בעצמם (registerMessages) — כך הוא לא נשלח לכל גולש בכל דף.
import * as common from './common';
import * as home from './home';
import * as problems from './problems';
import * as auth from './auth';
import * as ads from './ads';

export const he = { ...common.he, ...home.he, ...problems.he, ...auth.he, ...ads.he };
export const en = { ...common.en, ...home.en, ...problems.en, ...auth.en, ...ads.en };
