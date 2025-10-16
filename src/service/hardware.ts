import { KioskOrder, HardwareDevice } from '@/types';

export interface PrinterCommand {
  command: string;
  data: string;
}

export interface CashDrawerCommand {
  command: string;
  port?: string;
}

export interface ScannerData {
  code: string;
  type: 'barcode' | 'qr';
  timestamp: string;
}

class HardwareService {
  private devices: Map<string, HardwareDevice> = new Map();
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    this.initializeDevices();
    this.setupEventListeners();
  }

  private initializeDevices() {
    const defaultDevices: HardwareDevice[] = [
      { type: 'printer', name: 'POS Printer', status: 'disconnected', lastChecked: new Date().toISOString() },
      { type: 'cash_drawer', name: 'Cash Drawer', status: 'disconnected', lastChecked: new Date().toISOString() },
      { type: 'scanner', name: 'Barcode Scanner', status: 'disconnected', lastChecked: new Date().toISOString() },
      { type: 'display', name: 'Customer Display', status: 'disconnected', lastChecked: new Date().toISOString() }
    ];

    defaultDevices.forEach(device => {
      this.devices.set(device.name, device);
    });
  }

  private setupEventListeners() {
    // Listen for keyboard input (for barcode scanner simulation)
    document.addEventListener('keydown', (event) => {
      if (event.target instanceof HTMLInputElement) return;
      
      // Simulate barcode scanner input (rapid key presses)
      if (event.key.length === 1 && event.ctrlKey) {
        this.simulateBarcodeScan(event.key);
      }
    });

    // Listen for USB device connections (if supported)
    if ('usb' in navigator) {
      this.setupUSBListeners();
    }

    // Listen for serial port connections (if supported)
    if ('serial' in navigator) {
      this.setupSerialListeners();
    }
  }

  private setupUSBListeners() {
    // USB device connection simulation
    setTimeout(() => {
      this.updateDeviceStatus('POS Printer', 'connected');
      this.updateDeviceStatus('Cash Drawer', 'connected');
    }, 2000);
  }

  private setupSerialListeners() {
    // Serial port connection simulation
    setTimeout(() => {
      this.updateDeviceStatus('Barcode Scanner', 'connected');
      this.updateDeviceStatus('Customer Display', 'connected');
    }, 3000);
  }

  private simulateBarcodeScan(code: string) {
    const scannerData: ScannerData = {
      code,
      type: 'barcode',
      timestamp: new Date().toISOString()
    };
    
    this.emit('scanner', scannerData);
  }

  // Device Management
  getDevices(): HardwareDevice[] {
    return Array.from(this.devices.values());
  }

  getDevice(name: string): HardwareDevice | undefined {
    return this.devices.get(name);
  }

  updateDeviceStatus(name: string, status: HardwareDevice['status']) {
    const device = this.devices.get(name);
    if (device) {
      device.status = status;
      device.lastChecked = new Date().toISOString();
      this.emit('deviceStatusChanged', { name, status });
    }
  }

  // Event System
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // Printer Functions
  async printReceipt(order: KioskOrder): Promise<boolean> {
    const printer = this.devices.get('POS Printer');
    if (!printer || printer.status !== 'connected') {
      throw new Error('Printer not connected');
    }

    try {
      const receipt = this.generateReceipt(order);
      await this.sendToPrinter(receipt);
      return true;
    } catch (error) {
      console.error('Print error:', error);
      this.updateDeviceStatus('POS Printer', 'error');
      return false;
    }
  }

  private generateReceipt(order: KioskOrder): string {
    const lines: string[] = [];
    const width = 32; // 80mm paper width
    
    // Header
    lines.push('='.repeat(width));
    lines.push('HIGHLAND COFFEE'.padStart((width + 15) / 2));
    lines.push('123 Main Street, Yangon'.padStart((width + 20) / 2));
    lines.push('Tel: +95 1 234 5678'.padStart((width + 18) / 2));
    lines.push('='.repeat(width));
    
    // Order info
    lines.push(`Order ID: ${order.id}`);
    lines.push(`Date: ${new Date(order.createdAt).toLocaleString('vi-VN')}`);
    lines.push(`Cashier: ${order.cashierId || 'Kiosk'}`);
    lines.push('-'.repeat(width));
    
    // Items
    lines.push('ITEMS');
    lines.push('-'.repeat(width));
    order.items.forEach(item => {
      lines.push(item.product.name);
      lines.push(`  ${item.size} x ${item.quantity} = ${item.totalPrice.toLocaleString('vi-VN')}đ`);
    });
    
    lines.push('-'.repeat(width));
    lines.push(`Subtotal: ${order.subtotal.toLocaleString('vi-VN')}đ`);
    lines.push(`Tax (5%): ${order.tax.toLocaleString('vi-VN')}đ`);
    lines.push(`Total: ${order.total.toLocaleString('vi-VN')}đ`);
    lines.push(`Payment: ${order.paymentMethod.toUpperCase()}`);
    
    if (order.notes) {
      lines.push('');
      lines.push('Notes:');
      lines.push(order.notes);
    }
    
    lines.push('');
    lines.push('Thank you for your visit!');
    lines.push('='.repeat(width));
    
    return lines.join('\n');
  }

  private async sendToPrinter(receipt: string): Promise<void> {
    // In a real implementation, this would send ESC/POS commands to the printer
    // For now, we'll simulate the printing process
    
    console.log('=== RECEIPT ===');
    console.log(receipt);
    console.log('=== END RECEIPT ===');
    
    // Simulate printing delay
    await new Promise<void>(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation, you might use:
    // - Web Serial API for USB printers
    // - WebUSB API for USB devices
    // - WebSocket connection to a local printer service
    // - Native app integration via Electron
  }

  // Cash Drawer Functions
  async openCashDrawer(): Promise<boolean> {
    const cashDrawer = this.devices.get('Cash Drawer');
    if (!cashDrawer || cashDrawer.status !== 'connected') {
      throw new Error('Cash drawer not connected');
    }

    try {
      await this.sendCashDrawerCommand({ command: 'OPEN' });
      return true;
    } catch (error) {
      console.error('Cash drawer error:', error);
      this.updateDeviceStatus('Cash Drawer', 'error');
      return false;
    }
  }

  private async sendCashDrawerCommand(command: CashDrawerCommand): Promise<void> {
    // In a real implementation, this would send ESC/POS commands to open the cash drawer
    console.log('Opening cash drawer:', command);
    
    // Simulate opening delay
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Scanner Functions
  async startScanner(): Promise<void> {
    const scanner = this.devices.get('Barcode Scanner');
    if (!scanner || scanner.status !== 'connected') {
      throw new Error('Scanner not connected');
    }

    // In a real implementation, this would start listening for scanner input
    console.log('Scanner started');
  }

  async stopScanner(): Promise<void> {
    console.log('Scanner stopped');
  }

  // Customer Display Functions
  async updateCustomerDisplay(order: KioskOrder): Promise<boolean> {
    const display = this.devices.get('Customer Display');
    if (!display || display.status !== 'connected') {
      return false;
    }

    try {
      const displayData = this.generateDisplayData(order);
      await this.sendToDisplay(displayData);
      return true;
    } catch (error) {
      console.error('Display error:', error);
      return false;
    }
  }

  private generateDisplayData(order: KioskOrder): string {
    return `
HIGHLAND COFFEE
Order: ${order.id}
Total: ${order.total.toLocaleString('vi-VN')}đ
Thank you!
    `.trim();
  }

  private async sendToDisplay(data: string): Promise<void> {
    console.log('Customer Display:', data);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Test Functions
  async testAllDevices(): Promise<{ [key: string]: boolean }> {
    const results: { [key: string]: boolean } = {};
    
    for (const [name, device] of this.devices) {
      try {
        switch (device.type) {
          case 'printer':
            results[name] = await this.testPrinter();
            break;
          case 'cash_drawer':
            results[name] = await this.testCashDrawer();
            break;
          case 'scanner':
            results[name] = await this.testScanner();
            break;
          case 'display':
            results[name] = await this.testDisplay();
            break;
        }
      } catch (error) {
        results[name] = false;
      }
    }
    
    return results;
  }

  private async testPrinter(): Promise<boolean> {
    try {
      const testReceipt = 'TEST PRINT\n' + '='.repeat(32) + '\n';
      await this.sendToPrinter(testReceipt);
      return true;
    } catch {
      return false;
    }
  }

  private async testCashDrawer(): Promise<boolean> {
    try {
      await this.sendCashDrawerCommand({ command: 'TEST' });
      return true;
    } catch {
      return false;
    }
  }

  private async testScanner(): Promise<boolean> {
    // Scanner test is always successful in simulation
    return true;
  }

  private async testDisplay(): Promise<boolean> {
    try {
      await this.sendToDisplay('DISPLAY TEST');
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const hardwareService = new HardwareService();
export default hardwareService;
