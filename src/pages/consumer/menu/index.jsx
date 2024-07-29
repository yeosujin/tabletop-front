import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRScanner = ({ onScan }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    }, false);

    scanner.render(success, error);

    function success(result) {
      console.log('QR Code detected:', result);
      onScan(result);
      scanner.clear();
    }

    function error(err) {
      console.warn(err);
    }

    return () => {
      scanner.clear();
    };
  }, [onScan]);

  return (
    <div className="relative w-full h-64 bg-gray-200 flex items-center justify-center">
      <div id="reader"></div>
      <button onClick={() => onScan('1')} className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded">
        Simulate Scan
      </button>
    </div>
  );
};

// 메뉴 아이템 컴포넌트
const MenuItem = ({ item, onAddToCart }) => (
  <div className="flex items-center justify-between p-4 border-b">
    <div>
      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
      <h3 className="font-bold">{item.name}</h3>
      <p className="text-sm text-gray-600">{item.description}</p>
    </div>
    <button onClick={() => onAddToCart(item)} className="bg-blue-500 text-white px-3 py-1 rounded">
      Add
    </button>
  </div>
);

const MenuPage = () => {
  const [tableNumber, setTableNumber] = useState(null);
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);

  const handleQRScan = (scannedTableNumber) => {
    setTableNumber(scannedTableNumber);
    // QR 스캔 후 메뉴 데이터 가져오기
    fetchMenu(scannedTableNumber);
  };

  const fetchMenu = async (storeId) => {
    try {
      const response = await fetch(`/api/stores/${storeId}/menus`);
      const data = await response.json();
      setMenu(data);
    } catch (error) {
      console.error('Failed to fetch menu:', error);
    }
  };

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {!tableNumber ? (
        <QRScanner onScan={handleQRScan} />
      ) : (
        <>
          <Alert>
            <AlertDescription>Table No. {tableNumber}</AlertDescription>
          </Alert>
          <div className="mt-4">
            {menu.map((item) => (
              <MenuItem key={item.id} item={item} onAddToCart={addToCart} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MenuPage;