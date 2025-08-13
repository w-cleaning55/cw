'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  MapPin, 
  Navigation, 
  Search, 
  Target, 
  Map,
  Copy,
  Check,
  AlertTriangle,
  Loader2,
  Plus,
  Trash2
} from 'lucide-react';
import { HomeIcon, BuildingIcon, LocationIcon } from '@/components/ui/CompactIcons';
import { useTranslation } from '../hooks/useTranslation';
import { useNotify } from './NotificationSystem';

interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

interface AddressDetails {
  id?: string;
  name: string;
  street: string;
  district: string;
  city: string;
  postalCode?: string;
  coordinates?: Coordinates;
  buildingNumber?: string;
  floorNumber?: string;
  apartmentNumber?: string;
  landmark?: string;
  notes?: string;
  isDefault?: boolean;
  type: 'home' | 'work' | 'other';
}

interface AddressSelectorProps {
  onAddressSelect: (address: AddressDetails) => void;
  selectedAddress?: AddressDetails;
  showSavedAddresses?: boolean;
  allowMultiple?: boolean;
  className?: string;
}

export default function AddressSelector({
  onAddressSelect,
  selectedAddress,
  showSavedAddresses = true,
  allowMultiple = false,
  className = ''
}: AddressSelectorProps) {
  const { t } = useTranslation();
  const notify = useNotify();
  
  const [activeTab, setActiveTab] = useState<'manual' | 'coordinates' | 'map' | 'saved'>('manual');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<AddressDetails[]>([]);
  const [copiedCoords, setCopiedCoords] = useState(false);
  
  // عنوان يدوي
  const [manualAddress, setManualAddress] = useState<AddressDetails>({
    name: '',
    street: '',
    district: '',
    city: 'جدة',
    buildingNumber: '',
    floorNumber: '',
    apartmentNumber: '',
    landmark: '',
    notes: '',
    type: 'home'
  });

  // عنوان من الإحداثيات
  const [coordsAddress, setCoordsAddress] = useState<AddressDetails>({
    name: '',
    street: '',
    district: '',
    city: 'جدة',
    coordinates: undefined,
    type: 'home'
  });

  // الأحياء في جدة
  const jeddahDistricts = [
    'الحمراء', 'النسيم', 'الروضة', 'البوادي', 'الصفا', 'الزهراء',
    'السامر', 'النزهة', 'الفيصلية', 'السليمانية', 'المروة', 'الشاطئ',
    'البساتين', 'الخالدية', 'الرحاب', 'المحمدية', 'الثغر', 'الكندرة',
    'أبحر الشمالية', 'أبحر الجنوبية', 'ذهبان', 'الشرفية', 'العزيزية',
    'المنتزهات', 'النعيم', 'الورود', 'الجامعة', 'الأجاويد', 'العمارية',
    'الصحيفة', 'الربوة', 'المعارض', 'مدائن الفهد', 'حي الأمل'
  ];

  // أنواع العناوين
  const addressTypes = [
    { value: 'home', label: 'منزل', icon: <HomeIcon size="sm" /> },
    { value: 'work', label: 'عمل', icon: <BuildingIcon size="sm" /> },
    { value: 'other', label: 'أخرى', icon: <LocationIcon size="sm" /> }
  ];

  // تحميل العناوين المحفوظة
  useEffect(() => {
    const saved = localStorage.getItem('saved-addresses');
    if (saved) {
      try {
        setSavedAddresses(JSON.parse(saved));
      } catch (error) {
        console.error('خطأ في تحميل العناوين المحفوظة:', error);
      }
    }
  }, []);

  // حفظ العناوين
  const saveAddresses = useCallback((addresses: AddressDetails[]) => {
    try {
      localStorage.setItem('saved-addresses', JSON.stringify(addresses));
      setSavedAddresses(addresses);
    } catch (error) {
      console.error('خطأ في حفظ العناوين:', error);
      notify.error('خطأ في الحفظ', 'لم يتم حفظ العنوان');
    }
  }, [notify]);

  // الحصول على الموقع الحالي
  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      notify.error('الموقع غير مدعوم', 'متصفحك لا يدعم خدمات الموقع');
      return;
    }

    setIsLoadingLocation(true);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      const coords: Coordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      };

      setCurrentLocation(coords);
      
      // تحديث العنوان من الإحداثيات
      setCoordsAddress(prev => ({
        ...prev,
        coordinates: coords
      }));

      // محاولة الحصول على تفاصيل العنوان من الإحداثيات (Reverse Geocoding)
      await reverseGeocode(coords);

      notify.success('تم تحديد الموقع', 'تم الحصول على موقعك الحالي بنجاح');

    } catch (error: any) {
      console.error('خطأ في الحصول على الموقع:', error);
      
      let errorMessage = 'لم يتم الحصول على الموقع';
      if (error.code === 1) {
        errorMessage = 'يجب السماح بالوصول للموقع';
      } else if (error.code === 2) {
        errorMessage = 'الموقع غير متاح حالياً';
      } else if (error.code === 3) {
        errorMessage = 'انتهت مهلة الحصول على الموقع';
      }

      notify.error('خطأ في الموقع', errorMessage);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // تحويل الإحداثيات إلى عنوان (يحتاج API خارجي)
  const reverseGeocode = async (coords: Coordinates) => {
    try {
      // هنا يمكن استخدام Google Maps API أو أي خدمة أخرى
      // مثال بسيط بدون API خارجي
      
      // تقدير تقريبي للأحياء بناءً على الإحداثيات
      const estimatedDistrict = estimateDistrict(coords);
      
      setCoordsAddress(prev => ({
        ...prev,
        district: estimatedDistrict,
        street: `شارع بالقرب من ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`,
        name: `موقع من الإحداثيات - ${estimatedDistrict}`
      }));

    } catch (error) {
      console.error('خطأ في تحويل الإحداثيات:', error);
    }
  };

  // تقدير الحي بناءً على الإحداثيات (تقريبي)
  const estimateDistrict = (coords: Coordinates): string => {
    // إحداثيات تقريبية لأحياء جدة
    const districtCoords = {
      'الحمراء': { lat: 21.5433, lng: 39.1728 },
      'النسيم': { lat: 21.5169, lng: 39.2186 },
      'الروضة': { lat: 21.5507, lng: 39.1372 },
      'البوادي': { lat: 21.5297, lng: 39.1542 },
      'الصفا': { lat: 21.5751, lng: 39.1494 },
      'النزهة': { lat: 21.5883, lng: 39.1572 }
    };

    let closestDistrict = 'مجهول';
    let minDistance = Infinity;

    Object.entries(districtCoords).forEach(([district, districtCoord]) => {
      const distance = Math.sqrt(
        Math.pow(coords.latitude - districtCoord.lat, 2) + 
        Math.pow(coords.longitude - districtCoord.lng, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestDistrict = district;
      }
    });

    return closestDistrict;
  };

  // نسخ الإحداثيات
  const copyCoordinates = async () => {
    if (!currentLocation) return;

    const coordsText = `${currentLocation.latitude}, ${currentLocation.longitude}`;
    
    try {
      await navigator.clipboard.writeText(coordsText);
      setCopiedCoords(true);
      notify.success('تم النسخ', 'تم نسخ الإحداثيات');
      
      setTimeout(() => setCopiedCoords(false), 2000);
    } catch (error) {
      // Fallback للمتصفحات القديمة
      const textArea = document.createElement('textarea');
      textArea.value = coordsText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setCopiedCoords(true);
      notify.success('تم النسخ', 'تم نسخ الإحداثيات');
      setTimeout(() => setCopiedCoords(false), 2000);
    }
  };

  // حفظ عنوان جديد
  const saveNewAddress = (address: AddressDetails) => {
    const newAddress: AddressDetails = {
      ...address,
      id: Date.now().toString(),
    };

    const updatedAddresses = [...savedAddresses, newAddress];
    saveAddresses(updatedAddresses);
    
    notify.success('تم الحفظ', 'تم حفظ العنوان بنجاح');
  };

  // حذف عنوان محفوظ
  const deleteAddress = (id: string) => {
    const updatedAddresses = savedAddresses.filter(addr => addr.id !== id);
    saveAddresses(updatedAddresses);
    notify.success('تم الحذف', 'تم حذف العنوان');
  };

  // تعيين عنوان افتراضي
  const setDefaultAddress = (id: string) => {
    const updatedAddresses = savedAddresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));
    saveAddresses(updatedAddresses);
    notify.success('ت�� التحديث', 'تم تعيين العنوان الافتراضي');
  };

  // التحقق من صحة العنوان
  const validateAddress = (address: AddressDetails): string[] => {
    const errors: string[] = [];
    
    if (!address.name.trim()) errors.push('اسم العنوان مطلوب');
    if (!address.street.trim()) errors.push('الشارع مطلوب');
    if (!address.district.trim()) errors.push('الحي مطلوب');
    if (!address.city.trim()) errors.push('المدينة مطلوبة');
    
    return errors;
  };

  // اختيار العنوان
  const selectAddress = (address: AddressDetails) => {
    const errors = validateAddress(address);
    if (errors.length > 0) {
      notify.error('بيانات ناقصة', errors.join(', '));
      return;
    }

    onAddressSelect(address);
    notify.success('تم الاختيار', 'تم اختيار العنوان بنجاح');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            اختيار العنوان
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="manual" className="flex items-center gap-1">
                <Search className="w-4 h-4" />
                كتابة
              </TabsTrigger>
              <TabsTrigger value="coordinates" className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                إحداثيات
              </TabsTrigger>
              <TabsTrigger value="map" className="flex items-center gap-1">
                <Map className="w-4 h-4" />
                خريطة
              </TabsTrigger>
              {showSavedAddresses && (
                <TabsTrigger value="saved" className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  محفوظة
                </TabsTrigger>
              )}
            </TabsList>

            {/* كتابة العنوان يدوياً */}
            <TabsContent value="manual" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="manual-name">اسم العنوان *</Label>
                  <Input
                    id="manual-name"
                    value={manualAddress.name}
                    onChange={(e) => setManualAddress(prev => ({...prev, name: e.target.value}))}
                    placeholder="مثل: المنزل، المكتب"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manual-type">نوع العنوان</Label>
                  <Select 
                    value={manualAddress.type} 
                    onValueChange={(value: 'home' | 'work' | 'other') => 
                      setManualAddress(prev => ({...prev, type: value}))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {addressTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            {type.icon}
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manual-street">الشارع *</Label>
                  <Input
                    id="manual-street"
                    value={manualAddress.street}
                    onChange={(e) => setManualAddress(prev => ({...prev, street: e.target.value}))}
                    placeholder="اسم الشارع"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manual-district">الحي *</Label>
                  <Select 
                    value={manualAddress.district} 
                    onValueChange={(value) => setManualAddress(prev => ({...prev, district: value}))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الحي" />
                    </SelectTrigger>
                    <SelectContent>
                      {jeddahDistricts.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="manual-building">رقم المبنى</Label>
                    <Input
                      id="manual-building"
                      value={manualAddress.buildingNumber}
                      onChange={(e) => setManualAddress(prev => ({...prev, buildingNumber: e.target.value}))}
                      placeholder="123"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manual-floor">الطابق</Label>
                    <Input
                      id="manual-floor"
                      value={manualAddress.floorNumber}
                      onChange={(e) => setManualAddress(prev => ({...prev, floorNumber: e.target.value}))}
                      placeholder="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manual-apartment">الشقة</Label>
                    <Input
                      id="manual-apartment"
                      value={manualAddress.apartmentNumber}
                      onChange={(e) => setManualAddress(prev => ({...prev, apartmentNumber: e.target.value}))}
                      placeholder="A"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manual-landmark">معلم مميز</Label>
                  <Input
                    id="manual-landmark"
                    value={manualAddress.landmark}
                    onChange={(e) => setManualAddress(prev => ({...prev, landmark: e.target.value}))}
                    placeholder="بجانب مسجد، قرب مول، إلخ"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="manual-notes">ملاحظات إضافية</Label>
                <Textarea
                  id="manual-notes"
                  value={manualAddress.notes}
                  onChange={(e) => setManualAddress(prev => ({...prev, notes: e.target.value}))}
                  placeholder="أي ملاحظات تساعد في الوصول للموقع"
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={() => selectAddress(manualAddress)} className="flex-1">
                  <MapPin className="w-4 h-4 mr-2" />
                  اختيار هذا العنوان
                </Button>
                {showSavedAddresses && (
                  <Button 
                    variant="outline" 
                    onClick={() => saveNewAddress(manualAddress)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    حفظ
                  </Button>
                )}
              </div>
            </TabsContent>

            {/* الإحداثيات */}
            <TabsContent value="coordinates" className="space-y-4">
              <div className="space-y-4">
                <div className="text-center">
                  <Button
                    onClick={getCurrentLocation}
                    disabled={isLoadingLocation}
                    size="lg"
                    className="w-full md:w-auto"
                  >
                    {isLoadingLocation ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        جارٍ تحديد الموقع...
                      </>
                    ) : (
                      <>
                        <Navigation className="w-4 h-4 mr-2" />
                        تحديد موقعي الحالي
                      </>
                    )}
                  </Button>
                </div>

                {currentLocation && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">الإحداثيات الحالية:</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={copyCoordinates}
                          >
                            {copiedCoords ? (
                              <Check className="w-4 h-4 mr-1" />
                            ) : (
                              <Copy className="w-4 h-4 mr-1" />
                            )}
                            {copiedCoords ? 'تم النسخ' : 'نسخ'}
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">خط العرض:</span>
                            <p className="font-mono">{currentLocation.latitude.toFixed(6)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">خط الطول:</span>
                            <p className="font-mono">{currentLocation.longitude.toFixed(6)}</p>
                          </div>
                        </div>

                        {currentLocation.accuracy && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">دقة الموقع:</span>
                            <Badge variant="outline" className="ml-2">
                              ±{Math.round(currentLocation.accuracy)} متر
                            </Badge>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {coordsAddress.coordinates && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="coords-name">اسم العنوان</Label>
                        <Input
                          id="coords-name"
                          value={coordsAddress.name}
                          onChange={(e) => setCoordsAddress(prev => ({...prev, name: e.target.value}))}
                          placeholder="اسم الموقع"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="coords-district">الحي</Label>
                        <Select 
                          value={coordsAddress.district} 
                          onValueChange={(value) => setCoordsAddress(prev => ({...prev, district: value}))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {jeddahDistricts.map((district) => (
                              <SelectItem key={district} value={district}>
                                {district}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => selectAddress(coordsAddress)} className="flex-1">
                        <Target className="w-4 h-4 mr-2" />
                        اختيار هذا الموقع
                      </Button>
                      {showSavedAddresses && (
                        <Button 
                          variant="outline" 
                          onClick={() => saveNewAddress(coordsAddress)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          حفظ
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* الخريطة */}
            <TabsContent value="map" className="space-y-4">
              <div className="text-center py-8">
                <Map className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">اختيار من الخريطة</h3>
                <p className="text-muted-foreground mb-4">
                  هذه الميزة تتطلب تكامل مع خدمة الخرائط
                </p>
                <Button variant="outline" disabled>
                  قريباً - خريطة تفاعلية
                </Button>
              </div>
            </TabsContent>

            {/* العناوين المحفوظة */}
            {showSavedAddresses && (
              <TabsContent value="saved" className="space-y-4">
                {savedAddresses.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">لا توجد عناوين محفوظة</h3>
                    <p className="text-muted-foreground">
                      احفظ عناوينك المفضلة لاستخدامها لاحقاً
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedAddresses.map((address) => (
                      <Card key={address.id} className={address.isDefault ? 'ring-2 ring-primary' : ''}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {addressTypes.find(t => t.value === address.type)?.icon}
                                <h4 className="font-medium">{address.name}</h4>
                                {address.isDefault && (
                                  <Badge variant="default" className="text-xs">
                                    افتراضي
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="text-sm text-muted-foreground space-y-1">
                                <p>{address.street}, {address.district}</p>
                                <p>{address.city}</p>
                                {address.landmark && (
                                  <div className="flex items-center gap-1 text-xs">
                                    <LocationIcon size="xs" className="text-muted-foreground" />
                                    <span>{address.landmark}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => selectAddress(address)}
                              >
                                اختيار
                              </Button>
                              {!address.isDefault && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => address.id && setDefaultAddress(address.id)}
                                >
                                  افتراضي
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => address.id && deleteAddress(address.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>

      {/* العنوان المختار */}
      {selectedAddress && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">العنوان المختار:</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <div>
                {addressTypes.find(t => t.value === selectedAddress.type)?.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{selectedAddress.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedAddress.street}, {selectedAddress.district}, {selectedAddress.city}
                </p>
                {selectedAddress.coordinates && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <LocationIcon size="xs" />
                    <span>{selectedAddress.coordinates.latitude.toFixed(6)}, {selectedAddress.coordinates.longitude.toFixed(6)}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
