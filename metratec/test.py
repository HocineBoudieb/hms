from metratec_rfid import QRG2

import asyncio
from typing import List
from metratec_rfid import UhfTag
from metratec_rfid import RfidReaderException


async def main():
    """_summary_
    """
    # Create an instance and define the serial connection
    reader = QRG2("MyReader", "/dev/ttyAMA0")
    #reader = DeskIdUhf2(instance="Reader", serial_port="/dev/ttyACM0")
    # set a callback for the reader status
    reader.set_cb_status(lambda status: print(f"status changed: {status}"))
    # set a callback for the inventories
    reader.set_cb_inventory(lambda inventory: print(f"new inventory: {inventory}"))

    # connect the reader
    try:
        await reader.connect()
        # set the reader power
        await reader.set_power(9)
        # get the inventory
        while True:
            await asyncio.sleep(1)
            inventory: List[UhfTag] = await reader.get_inventory()
            # print inventory
            print(f'Transponder found: {len(inventory)}')
            if len(inventory) == 0:
                print("No inventory")
                
            for tag in inventory:
                print(f'{tag.get_epc()}')

    except Exception as err:
        print(f"Reader exception: {err}")
    finally:
        try:
            await reader.disconnect()
        except RfidReaderException as err:
            print(f"Error disconnect: {err}")
    # Program finished

if __name__ == '__main__':
    loop = asyncio.new_event_loop()
    loop.run_until_complete(main())