import tkinter as tk
from tkinter import ttk
import requests
import threading
import time
from datetime import datetime, timedelta
import random

class AntennaSimulator:
    def __init__(self, master):
        self.master = master
        self.master.title("Antenna RFID Simulator")
        self.master.geometry("1200x800")

        self.antennas = {1: [], 2: [], 3: []}
        self.registration_antenna = []
        self.send_data = False
        self.endpoint = "http://localhost:8081/antennas/{}/rfids"
        self.order_endpoint = "http://localhost:8081/orders"

        self.create_widgets()

    def create_widgets(self):
        # Create main antenna frames
        self.antenna_frames = {}
        for i in range(1, 4):
            frame = ttk.LabelFrame(self.master, text=f"Antenna {i}")
            frame.grid(row=0, column=i-1, padx=10, pady=10, sticky="nsew")
            frame.config(width=100, height=100)
            frame.grid_propagate(False)
            self.antenna_frames[i] = frame

        # Create registration antenna frame
        self.registration_frame = ttk.LabelFrame(self.master, text="Registration Antenna (0)")
        self.registration_frame.grid(row=0, column=3, padx=10, pady=10, sticky="nsew")
        self.registration_frame.config(width=100, height=100)
        self.registration_frame.grid_propagate(False)

        # Create RFID boxes
        self.rfid_boxes = {}
        for i in range(1, 16):
            box = tk.Label(self.master, text=f"RFID_{i}", relief="raised", width=8, height=2)
            box.grid(row=1 + (i-1)//5, column=(i-1)%5, padx=5, pady=5)
            box.bind("<ButtonPress-1>", self.on_drag_start)
            box.bind("<B1-Motion>", self.on_drag_motion)
            box.bind("<ButtonRelease-1>", self.on_drag_release)
            self.rfid_boxes[i] = box

        # Send data toggle
        self.send_button = ttk.Button(self.master, text="Start Sending Data", command=self.toggle_send_data)
        self.send_button.grid(row=5, column=0, columnspan=4, pady=10)

        # Add button to open antenna list window
        self.list_button = ttk.Button(self.master, text="Show Antenna Lists", command=self.open_antenna_list_window)
        self.list_button.grid(row=6, column=0, columnspan=4, pady=10)

        # Add RFID selection dropdown
        ttk.Label(self.master, text="Select RFID for Order:").grid(row=7, column=0, columnspan=4, pady=(10, 0))
        self.rfid_combobox = ttk.Combobox(self.master, values=[f"RFID_{i}" for i in range(1, 16)])
        self.rfid_combobox.grid(row=8, column=0, columnspan=4, pady=(0, 10))
        self.rfid_combobox.set("RFID_1")  # Set default value

        # Add button to request order creation
        self.order_button = ttk.Button(self.master, text="Create New Order", command=self.request_order_creation)
        self.order_button.grid(row=9, column=0, columnspan=4, pady=10)

        # Add button to register RFIDs
        self.register_button = ttk.Button(self.master, text="Register RFIDs", command=self.register_rfids)
        self.register_button.grid(row=10, column=0, columnspan=4, pady=10)

        # Configure grid
        for i in range(4):
            self.master.grid_columnconfigure(i, weight=1)
        for i in range(11):
            self.master.grid_rowconfigure(i, weight=1)

    def on_drag_start(self, event):
        widget = event.widget
        widget._drag_start_x = event.x
        widget._drag_start_y = event.y

    def on_drag_motion(self, event):
        widget = event.widget
        x = widget.winfo_x() - widget._drag_start_x + event.x
        y = widget.winfo_y() - widget._drag_start_y + event.y
        widget.place(x=x, y=y)

    def on_drag_release(self, event):
        widget = event.widget
        x = widget.winfo_rootx() - self.master.winfo_rootx()
        y = widget.winfo_rooty() - self.master.winfo_rooty()

        for antenna_id, frame in self.antenna_frames.items():
            if frame.winfo_rootx() <= x <= frame.winfo_rootx() + frame.winfo_width() and \
               frame.winfo_rooty() <= y <= frame.winfo_rooty() + frame.winfo_height():
                rfid_id = int(widget.cget("text").split("_")[1])
                self.move_rfid_to_antenna(rfid_id, antenna_id)
                break
        else:
            if self.registration_frame.winfo_rootx() <= x <= self.registration_frame.winfo_rootx() + self.registration_frame.winfo_width() and \
               self.registration_frame.winfo_rooty() <= y <= self.registration_frame.winfo_rooty() + self.registration_frame.winfo_height():
                rfid_id = int(widget.cget("text").split("_")[1])
                self.move_rfid_to_registration(rfid_id)
            else:
                # If RFID is not moved to any antenna, place it back to its original position
                # Remove the RFID from the registration antenna if it's moved out
                rfid_id = int(widget.cget("text").split("_")[1])
                if rfid_id in self.registration_antenna:
                    self.registration_antenna.remove(rfid_id)
                for ant in self.antennas.values():
                    if rfid_id in ant:
                        ant.remove(rfid_id)
                widget.place_forget()
                widget.grid(row=1 + (int(widget.cget("text").split("_")[1])-1)//5, 
                            column=(int(widget.cget("text").split("_")[1])-1)%5, 
                            padx=5, pady=5)

    def move_rfid_to_antenna(self, rfid_id, antenna_id):
        # Remove RFID from all antennas and registration
        for ant in self.antennas.values():
            if rfid_id in ant:
                ant.remove(rfid_id)
        if rfid_id in self.registration_antenna:
            self.registration_antenna.remove(rfid_id)

        # Add RFID to the new antenna
        self.antennas[antenna_id].append(rfid_id)

        # Update the RFID box position
        self.rfid_boxes[rfid_id].place_forget()
        self.rfid_boxes[rfid_id].place(in_=self.antenna_frames[antenna_id], 
                                       x=10 + (len(self.antennas[antenna_id])-1)%3 * 80, 
                                       y=10 + (len(self.antennas[antenna_id])-1)//3 * 40)

        if self.list_window_exists():
            self.update_antenna_lists()

    def move_rfid_to_registration(self, rfid_id):
        # Remove RFID from all antennas and registration
        for ant in self.antennas.values():
            if rfid_id in ant:
                ant.remove(rfid_id)
        if rfid_id in self.registration_antenna:
            self.registration_antenna.remove(rfid_id)

        # Add RFID to the registration antenna
        self.registration_antenna.append(rfid_id)

        # Update the RFID box position
        self.rfid_boxes[rfid_id].place_forget()
        self.rfid_boxes[rfid_id].place(in_=self.registration_frame, 
                                       x=10 + (len(self.registration_antenna)-1)%3 * 80, 
                                       y=10 + (len(self.registration_antenna)-1)//3 * 40)

        if self.list_window_exists():
            self.update_antenna_lists()

    def toggle_send_data(self):
        self.send_data = not self.send_data
        if self.send_data:
            self.send_button.config(text="Stop Sending Data")
            threading.Thread(target=self.send_data_loop, daemon=True).start()
        else:
            self.send_button.config(text="Start Sending Data")

    def send_data_loop(self):
        while self.send_data:
            self.send_antenna_data()
            time.sleep(10)

    def send_antenna_data(self):
        for antenna_id, rfids in self.antennas.items():
            if rfids:
                data = {
                    "rfids": rfids,
                    "timestamp": datetime.now().isoformat()
                }
            else:
                data = {
                    "rfids": [],
                    "timestamp": datetime.now().isoformat()
                }
            
            url = self.endpoint.format(antenna_id) 
            try:
                response = requests.post(url, json=data)
                print(f"Sent data for Antenna {antenna_id}: {response.status_code}")
                print(f"Data sent: {data}")
            except requests.RequestException as e:
                print(f"Error sending data for Antenna {antenna_id}: {e}")

    def list_window_exists(self):
        return hasattr(self, 'list_window') and self.list_window.winfo_exists()

    def open_antenna_list_window(self):
        if self.list_window_exists():
            self.list_window.lift()
            return

        self.list_window = tk.Toplevel(self.master)
        self.list_window.title("Antenna Lists")
        self.list_window.geometry("400x300")

        self.antenna_text_boxes = {}
        for i in range(4):
            label = tk.Label(self.list_window, text=f"{'Registration' if i == 0 else 'Antenna'} {i}")
            label.grid(row=i, column=0, padx=5, pady=5)
            text_box = tk.Text(self.list_window, height=5, width=30)
            text_box.grid(row=i, column=1, padx=5, pady=5)
            self.antenna_text_boxes[i] = text_box

        self.update_antenna_lists()

    def update_antenna_lists(self):
        if not self.list_window_exists():
            return

        for i in range(4):
            text_box = self.antenna_text_boxes[i]
            if text_box.winfo_exists():
                text_box.delete('1.0', tk.END)
                if i == 0:
                    text_box.insert(tk.END, ', '.join(map(str, self.registration_antenna)))
                else:
                    text_box.insert(tk.END, ', '.join(map(str, self.antennas[i])))

        if self.list_window_exists():
            self.list_window.after(1000, self.update_antenna_lists)

    def request_order_creation(self):
        selected_rfid = self.rfid_combobox.get()
        selected_rfid = int(selected_rfid.split("_")[1])
        print(f"Creating order for RFID {selected_rfid}...")
        
        start_date = datetime.now()
        end_date = start_date + timedelta(days=random.randint(1, 7))
        order = {
            "rfidId": selected_rfid,
            "startDate": start_date.isoformat(),
            "endDate": end_date.isoformat(),
            "status": 0,
            "enCoursId": 22,
            "workshopId": 23
        }
        print(f"Order data: {order}")

        try:
            response = requests.post(self.order_endpoint, json=order)
            if response.status_code == 200:
                print(f"Order created successfully: {response.json()}")
            else:
                print(f"Failed to create order. Status code: {response.status_code}")
        except requests.RequestException as e:
            print(f"Error creating order: {e}")

    def register_rfids(self):
        if not self.registration_antenna:
            print("No RFIDs in the registration antenna.")
            return

        try:
            response = requests.post(self.endpoint.format(0), json={"rfids": self.registration_antenna})
            if response.status_code == 200:
                print(f"RFIDs registered successfully: {response.json()}")
            else:
                print(f"Failed to register RFIDs. Status code: {response.status_code}")
        except requests.RequestException as e:
            print(f"Error registering RFIDs: {e}")

if __name__ == "__main__":
    root = tk.Tk()
    app = AntennaSimulator(root)
    root.mainloop()
