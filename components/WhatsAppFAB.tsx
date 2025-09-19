import React from "react";
import UIkit from "./UIkit";

export default function WhatsAppFAB() {
  const openChatbot = () => {
    const evt = new CustomEvent("open-chatbot");
    window.dispatchEvent(evt);
  };

  return (
    <UIkit.FAB ariaLabel="Servis Botu" onClick={openChatbot}>
      <img src="/wa-logo.svg" alt="WhatsApp" style={{ width: 22, height: 22 }} />
    </UIkit.FAB>
  );
}