// user send
export const LINE_SELECTION_MENU_KEYWORD = 'คุยเรื่องอะไรกันดี!';

// Invalid reply
export const LINE_INVALID_MESSAGE_REPLY =
  'ขออภัย ผมยังไม่รองรับข้อความประเภทนี้ครับ..';
export const LINE_INVALID_VERIFICATION_REPLY = 'รหัสยืนยันไม่ถูกต้อง';
export const LINE_INVALID_PROJECT_SELECTION_REPLY =
  'ไม่พบหัวข้อที่คุณเลือก โปรดกดเลือกหัวข้ออีกครั้งครับ';
export const LINE_NO_PROJECT_REPLY =
  'บัญชีของคุณยังไม่ได้ผูกกับหัวข้อใดๆ โปรดติดต่อแอดมินเพื่อให้ช่วยตรวจสอบ';
export const LINE_AI_ERROR_REPLY = 'ระบบขัดข้องโปรดลองใหม่อีกครั้ง';

// success reply
export const LINE_SUCCESS_VERIFICATION_REPLY = 'ยืนยันตัวตนสำเร็จ';
export const LINE_PROMPT_PROJECT_SELECTION_REPLY =
  'เลือกโปรเจ็คที่คุณต้องการพูดคุย';
export const LINE_SUCCESS_PROJECT_SELECTION_REPLY = (projectName: string) =>
  `เลือก หัวข้อ ${projectName} สำเร็จคุยได้เลย`;
