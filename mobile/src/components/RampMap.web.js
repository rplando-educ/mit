import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

const iframeStyle = {
  width: '100%',
  height: '100%',
  minHeight: 205,
  border: 0,
};

export default function RampMap({ region, style, markers = [], selectedMarker, onMapPress, onRegionChangeComplete }) {
  const [mapSize, setMapSize] = useState({ width: 0, height: 0 });
  const [localRegion, setLocalRegion] = useState(region);
  const activeRegion = onRegionChangeComplete ? region : localRegion;
  const center = selectedMarker?.coordinate || activeRegion;
  const latitude = Number(center.latitude);
  const longitude = Number(center.longitude);
  const spread = Number(activeRegion.latitudeDelta || 0.02);
  const bbox = [
    longitude - spread,
    latitude - spread,
    longitude + spread,
    latitude + spread,
  ].join(',');
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`;

  useEffect(() => {
    setLocalRegion(region);
  }, [region]);

  function updateRegion(nextRegion) {
    setLocalRegion(nextRegion);
    onRegionChangeComplete?.(nextRegion);
  }

  function zoom(factor) {
    const nextRegion = {
      ...activeRegion,
      latitudeDelta: Math.max(0.002, Math.min(1, Number(activeRegion.latitudeDelta || 0.02) * factor)),
      longitudeDelta: Math.max(0.002, Math.min(1, Number(activeRegion.longitudeDelta || 0.02) * factor)),
    };

    updateRegion(nextRegion);
  }

  function dropAtPoint(event) {
    const width = mapSize.width || 1;
    const height = mapSize.height || 1;
    const nativeEvent = event.nativeEvent || {};
    const x = nativeEvent.offsetX ?? nativeEvent.locationX ?? width / 2;
    const y = nativeEvent.offsetY ?? nativeEvent.locationY ?? height / 2;
    const nextLatitude = Number(activeRegion.latitude) + (0.5 - y / height) * Number(activeRegion.latitudeDelta || 0.02);
    const nextLongitude = Number(activeRegion.longitude) + (x / width - 0.5) * Number(activeRegion.longitudeDelta || 0.02);

    onMapPress?.({
      nativeEvent: {
        coordinate: {
          latitude: nextLatitude,
          longitude: nextLongitude,
        },
      },
    });
  }

  return (
    <View style={[styles.mapFallback, style]}>
      <View
        style={styles.frame}
        onLayout={(event) => setMapSize(event.nativeEvent.layout)}
      >
        <iframe
          title="RAMP accessibility map"
          src={mapUrl}
          style={iframeStyle}
          loading="lazy"
        />
        {onMapPress ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tap map to drop a pin"
            style={styles.tapLayer}
            onPress={dropAtPoint}
          />
        ) : null}
        <View style={styles.zoomControls}>
          <Pressable accessibilityRole="button" accessibilityLabel="Zoom in" style={styles.zoomButton} onPress={() => zoom(0.55)}>
            <Text style={styles.zoomText}>+</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Zoom out" style={styles.zoomButton} onPress={() => zoom(1.8)}>
            <Text style={styles.zoomText}>-</Text>
          </Pressable>
        </View>
        {selectedMarker ? <View pointerEvents="none" style={styles.pinPreview} /> : null}
        {onMapPress ? (
          <View pointerEvents="none" style={styles.tapHint}>
            <Text style={styles.tapHintText}>Tap map to drop pin</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.meta}>Center: {Number(activeRegion.latitude).toFixed(6)}, {Number(activeRegion.longitude).toFixed(6)}</Text>
      {selectedMarker ? (
        <Text style={styles.selected}>Selected pin: {Number(selectedMarker.coordinate.latitude).toFixed(6)}, {Number(selectedMarker.coordinate.longitude).toFixed(6)}</Text>
      ) : null}
      {markers.length > 0 && (
        <View style={styles.list}>
          {markers.slice(0, 6).map((marker) => (
            <Pressable key={marker.id} style={styles.markerRow} onPress={marker.onPress}>
              <Text style={styles.markerTitle}>{marker.title}</Text>
              <Text style={styles.markerAddress}>{marker.description}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mapFallback: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    padding: 10,
    backgroundColor: colors.white,
    gap: 10,
    overflow: 'hidden',
  },
  frame: {
    flex: 1,
    minHeight: 205,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#e8f1ef',
  },
  tapLayer: {
    ...StyleSheet.absoluteFillObject,
    cursor: 'crosshair',
  },
  zoomControls: {
    position: 'absolute',
    right: 10,
    top: 10,
    gap: 8,
    zIndex: 4,
  },
  zoomButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    boxShadow: '0 3px 10px rgba(15, 23, 42, 0.18)',
  },
  zoomText: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 28,
  },
  pinPreview: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 18,
    height: 18,
    marginLeft: -9,
    marginTop: -18,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: colors.white,
    backgroundColor: '#ef4444',
    boxShadow: '0 6px 14px rgba(15, 23, 42, 0.28)',
  },
  tapHint: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.76)',
  },
  tapHintText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
  },
  meta: {
    color: colors.muted,
    fontWeight: '700',
  },
  selected: {
    color: colors.brandDark,
    fontWeight: '800',
  },
  list: {
    gap: 8,
  },
  markerRow: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: colors.white,
  },
  markerTitle: {
    color: colors.ink,
    fontWeight: '800',
  },
  markerAddress: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 12,
  },
});
