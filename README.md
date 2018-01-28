# avr-mqtt
Project designed to bridge all my AVRs to MQTT for both control and events

## Event Topics (Outbound)

- `{PREFIX}/livingroom/mute`
- `{PREFIX}/livingroom/volume`
- `{PREFIX}/livingroom/power`
- `{PREFIX}/livingroom/input`

## Control Topics (Inbound)

- `{PREFIX}/livingroom/mute/set`
- `{PREFIX}/livingroom/mute/toggle`
- `{PREFIX}/livingroom/volume/set`
- `{PREFIX}/livingroom/volume/adjust`
- `{PREFIX}/livingroom/power/set`
- `{PREFIX}/livingroom/power/toggle`
- `{PREFIX}/livingroom/input/set`
