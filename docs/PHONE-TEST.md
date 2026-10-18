# Phone test checklist

**Open:** https://baed-app.vercel.app on a real phone (https is needed for the camera).
Test on at least one **Android (Chrome)** and one **iPhone (Safari)**. A low-end Android is the most useful.
Everything is demo data: nothing is sent anywhere, and a reload resets the app.

Note the **build** shown at the bottom of the You tab in every bug report, plus phone model, OS and browser.

## 1. Install (3 min)
- [ ] Android: the "Add Bae'd to your home screen" sheet appears, Install works, the app opens full screen with the heart icon.
- [ ] iPhone: Share > Add to Home Screen works, the icon looks right, the app opens without Safari bars.
- [ ] Turn on airplane mode, reopen the app: it still loads and shows the offline banner.

## 2. Sign up and verify (10 min)
- [ ] Phone number: the number pad opens; a wrong-looking number shows an error.
- [ ] Code: any 6 digits work, **000000** shows the wrong-code error.
- [ ] Allow the camera for the ID. The frame is easy to line up, the shutter is easy to reach with a thumb.
- [ ] Deny the camera once (or block it in settings): you see the "blocked" message with steps, and Try again works after allowing.
- [ ] ID photo in dim light: you get a "dark" or "blurry" warning with Retake / Use anyway.
- [ ] Choose an ID photo from the library instead (Android and iPhone). A HEIC photo should give a clear message or work.
- [ ] Selfie with the front camera: the preview looks natural and the oval is centred.
- [ ] Processing finishes and shows **Verified**. Repeat later with **?fail** added to the processing URL to see the failed screen.

## 3. Profile (5 min)
- [ ] Name, age (try 17), gender, city. Under 18 is blocked.
- [ ] Preference, intent, location. "Allow location" prompts once; "Not now" moves on.
- [ ] Add photos: take one, choose several, remove one, make another main, try a PDF (should be refused).
- [ ] Bio, interests, preview shows your main photo.

## 4. Main app (10 min)
- [ ] Discover: photo loads, like and pass work, tap the card for the full profile.
- [ ] Profile detail: swipe through photos, scroll (the colour fades and a slim bar appears), report sheet opens.
- [ ] Like **Priya** or **Meera**: you get a match moment. Matches shows new matches only.
- [ ] Chats: two demo conversations with time and an unread count. Open one, send a message, the reply arrives, the dot on the Chats tab clears.
- [ ] Type "send me money on UPI" in a chat: the warning appears.
- [ ] Safe Date: fill it in and save. You > Delete account asks you to type DELETE.

## 5. Feel (5 min)
- [ ] Rotate to landscape and back: nothing breaks.
- [ ] Set the phone's text size to the largest: nothing is cut off or overlaps the buttons.
- [ ] Screen reader on (TalkBack or VoiceOver): the main screens read in a sensible order and buttons have names.
- [ ] Slow network (or add **?slow**): skeletons show, then content. Add **?fail=feed** to see the error and Try again.
- [ ] Anything that felt slow, confusing, hard to tap or ugly. Note the screen and take a screenshot.

## Demo switches (add to any URL)
`?slow` shows loading states. `?fail=feed|profile|matches|chat|otp|all` shows error states.

## Known limits
Mock data and stock-photo "people" (see public/photos/CREDITS.md). No real SMS, no real identity check, no real chat.
Messages and photos are kept in memory only. The quality check thresholds are untuned and may over- or under-warn.
