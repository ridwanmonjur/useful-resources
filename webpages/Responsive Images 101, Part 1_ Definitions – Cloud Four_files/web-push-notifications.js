import { b as createSubscribe } from '/wp-content/themes/cloudfour2022/static/scripts/rollup-chunk-cloudfour-patterns-9a5f6796.js';

const subscribeEl = document.querySelector(".js-subscribe");
const subscribeComponent = createSubscribe(subscribeEl);
const init = () => {
  subscribeComponent?.init();
  let isPending = false;
  const buttonSwapEl = subscribeEl.querySelector(".js-button-swap");
  if (!buttonSwapEl)
    return;
  buttonSwapEl.hidden = false;
  const webPushSubscribeBtnWrapper = buttonSwapEl.querySelector(
    ".js-button-swap__initial-button-wrapper"
  );
  const webPushUnsubscribeBtnWrapper = buttonSwapEl.querySelector(
    ".js-button-swap__swapped-button-wrapper"
  );
  const webPushSubscribeBtn = webPushSubscribeBtnWrapper?.querySelector(
    ".js-subscribe__control"
  );
  const webPushUnsubscribeBtn = webPushUnsubscribeBtnWrapper?.querySelector(
    ".js-subscribe__control"
  );
  if (!webPushSubscribeBtn || !webPushUnsubscribeBtn)
    return;
  const cleanupFunctions = [];
  const onNotificationsPermissionChange = (permissionChange) => {
    console.log("Permission state:", permissionChange.to);
    for (const cleanupFunction of cleanupFunctions) {
      cleanupFunction();
    }
    init();
  };
  window.OneSignal.push(() => {
    window.OneSignal.on(
      "notificationPermissionChange",
      onNotificationsPermissionChange
    );
  });
  cleanupFunctions.push(() => {
    window.OneSignal.push(() => {
      window.OneSignal.off(
        "notificationPermissionChange",
        onNotificationsPermissionChange
      );
    });
  });
  if (!window.OneSignal.isPushNotificationsSupported()) {
    subscribeComponent?.destroy();
    return;
  }
  const webPushNotificationBtns = [webPushSubscribeBtn, webPushUnsubscribeBtn];
  const showBtnLoadingState = () => {
    isPending = true;
    for (const btn of webPushNotificationBtns) {
      btn.classList.add("is-loading");
    }
  };
  const removeBtnLoadingState = () => {
    isPending = false;
    for (const btn of webPushNotificationBtns) {
      btn.classList.remove("is-loading");
    }
  };
  const onSubscribeClick = () => {
    if (isPending)
      return;
    console.log("Subscribe!");
    showBtnLoadingState();
    window.OneSignal.push(async () => {
      await window.OneSignal.showNativePrompt();
      await window.OneSignal.setSubscription(true);
    });
  };
  webPushSubscribeBtn.addEventListener("click", onSubscribeClick);
  cleanupFunctions.push(
    () => webPushSubscribeBtn.removeEventListener("click", onSubscribeClick)
  );
  const onUnsubscribeClick = () => {
    if (isPending)
      return;
    console.log("Unsubscribe!");
    showBtnLoadingState();
    window.OneSignal.push(async () => {
      await window.OneSignal.setSubscription(false);
    });
  };
  webPushUnsubscribeBtn.addEventListener("click", onUnsubscribeClick);
  cleanupFunctions.push(
    () => webPushUnsubscribeBtn.removeEventListener("click", onUnsubscribeClick)
  );
  const updateSubscribeBtnFocus = (setFocus, wrapper) => {
    if (!setFocus)
      return;
    const btn = wrapper.querySelector(".js-button-swap__button");
    btn.focus();
  };
  const showWebPushUnsubscribeBtn = ({ setFocus = false } = {}) => {
    buttonSwapEl.hidden = false;
    if (webPushSubscribeBtnWrapper) {
      webPushSubscribeBtnWrapper.hidden = true;
    }
    if (webPushUnsubscribeBtnWrapper) {
      webPushUnsubscribeBtnWrapper.hidden = false;
      updateSubscribeBtnFocus(setFocus, webPushUnsubscribeBtnWrapper);
    }
  };
  const showWebPushSubscribeBtn = ({ setFocus = false } = {}) => {
    buttonSwapEl.hidden = false;
    if (webPushUnsubscribeBtnWrapper) {
      webPushUnsubscribeBtnWrapper.hidden = true;
    }
    if (webPushSubscribeBtnWrapper) {
      webPushSubscribeBtnWrapper.hidden = false;
      updateSubscribeBtnFocus(setFocus, webPushSubscribeBtnWrapper);
    }
  };
  window.OneSignal.push(async () => {
    const isEnabled = await window.OneSignal.isPushNotificationsEnabled();
    const isDenied = await window.OneSignal?.getNotificationPermission() === "denied";
    if (isDenied) {
      subscribeComponent?.destroy();
    } else if (isEnabled) {
      showWebPushUnsubscribeBtn();
    } else {
      showWebPushSubscribeBtn();
    }
    removeBtnLoadingState();
    const onSubscriptionChange = (isSubscribed) => {
      console.log(
        "OneSignal: Subscription Change, isSubscribed:",
        isSubscribed
      );
      removeBtnLoadingState();
      if (isSubscribed) {
        showWebPushUnsubscribeBtn({ setFocus: true });
      } else {
        showWebPushSubscribeBtn({ setFocus: true });
        new Notification("Cloud Four", {
          body: "Notifications are now turned off.",
          icon: "/wp-content/themes/cloudfour2022/node_modules/@cloudfour/patterns/src/assets/favicons/icon-512.png"
        });
      }
    };
    window.OneSignal.on("subscriptionChange", onSubscriptionChange);
    cleanupFunctions.push(() => {
      window.OneSignal.push(() => {
        window.OneSignal.off("subscriptionChange", onSubscriptionChange);
      });
    });
  });
};
if (window.OneSignal?.init) {
  window.OneSignal.push(() => {
    window._oneSignalInitOptions.path = "/";
    window.OneSignal.SERVICE_WORKER_UPDATER_PATH = "OneSignalSDKUpdaterWorker.js";
    window.OneSignal.SERVICE_WORKER_PATH = "OneSignalSDKWorker.js";
    window.OneSignal.init(window._oneSignalInitOptions);
  });
  init();
} else {
  console.warn(
    "OneSignal is not available. It may be blocked by the browser client."
  );
  subscribeComponent?.destroy();
}
