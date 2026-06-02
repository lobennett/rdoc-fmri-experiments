# Karabiner-Elements Button-Box Config

This directory contains Karabiner-Elements profiles that remap the response
button box (device vendor `6171` / product `6`) for the RDoC fMRI tasks. The
remaps apply **only to that device** and do not affect the Mac's built-in
keyboard.

---

## Install

1. Install [Karabiner-Elements](https://karabiner-elements.pqrs.org/) for
   macOS.
2. Back up any existing config (if present):
   ```bash
   cp ~/.config/karabiner/karabiner.json ~/.config/karabiner/karabiner.json.bak
   ```
3. Copy this repo's config into place:
   ```bash
   cp karabiner/karabiner.json ~/.config/karabiner/karabiner.json
   ```
4. Restart Karabiner-Elements so it loads the new profiles.

---

## Profiles & Mappings

| Button | `span` profile | `non-span` profile |
|--------|---------------|-------------------|
| 1      | `right_arrow` | `b`               |
| 2      | `down_arrow`  | `y`               |
| 3      | `left_arrow`  | `g`               |
| 4      | `up_arrow`    | `r`               |
| 5      | `spacebar`    | `e`               |

---

## Usage

Switch the active profile via the Karabiner-Elements menu-bar icon →
**Profiles**.

- Use **`span`** for `operation_span`, `operation_only_span`, and
  `simple_span`.
- Use **`non-span`** for every other task.

Switch profiles per task before each run.

---

## Troubleshooting

If the button box is not being remapped, confirm that Karabiner-Elements
recognises the device. Open **Karabiner-EventViewer** and press a button on
the box; the event viewer will display the vendor ID and product ID for the
device that generated the event. The expected values are vendor `6171` /
product `6`.
