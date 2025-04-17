import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { MediaType, Asset, AssetInfo } from 'expo-media-library';
import VideoScreen from "@/app/VideoScreen";

const MediaLibraryPicker = () => {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [pageInfo, setPageInfo] = useState<MediaLibrary.PagedInfo<MediaLibrary.Asset> | null>(null);
    const [hasPermission, setHasPermission] = useState(false);

    const handleOpenGallery = async () => {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
            console.warn('MediaLibrary permission not granted');
            return;
        }
        setHasPermission(true);

        try {
            const media = await MediaLibrary.getAssetsAsync({
                mediaType: [MediaType.photo, MediaType.video],
                sortBy: MediaLibrary.SortBy.creationTime,
                first: 50,
                after: pageInfo?.endCursor || undefined,
            });

            for (const asset of media.assets) {
                const assetDetails: AssetInfo = await MediaLibrary.getAssetInfoAsync(asset.id);
                if (asset.mediaType === MediaType.video) {
                    asset.uri = assetDetails.localUri!.replace(/(\.MOV|\.mov).*$/, "$1")!
                    console.log(asset.uri);
                }
                asset.uri = assetDetails.localUri!;
            }

            setAssets((prev) => [...prev, ...media.assets]);
            setPageInfo(media);
        } catch (err) {
            console.error('Error fetching media:', err);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleOpenGallery} style={styles.button}>
                <Text style={styles.buttonText}>Open Media Library</Text>
            </TouchableOpacity>

            {assets.length > 0 && (
                <FlatList
                    data={assets}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        item.mediaType === MediaType.video ? (
                            <VideoScreen
                                source={item.uri}
                                style={styles.mediaItem}
                            />
                        ) : (
                            <Image
                                source={{ uri: item.uri }}
                                style={styles.mediaItem}
                                resizeMode="cover"
                            />
                        )
                    )}
                    numColumns={3}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: '#4A90E2',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    mediaItem: {
        width: '30%',
        aspectRatio: 1,
        margin: '1.5%',
        borderRadius: 8,
        overflow: 'hidden',
    },
});

export default MediaLibraryPicker;
