import React from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView, VideoPlayer } from 'expo-video';
import {Asset} from "expo-asset";

interface VideoScreenProps {
    source: string;
    asset?: Asset;
}

export default function VideoScreen({ source, asset }: VideoScreenProps): JSX.Element {
    const player: VideoPlayer = useVideoPlayer(source, player => {
        player.loop = false;
    });

    const { isPlaying } = useEvent(player, 'playingChange', {
        isPlaying: player.playing,
    });

    return (
        <View style={styles.contentContainer}>
            <VideoView
                style={{
                    width: 200,
                    height: 200,
                }}
                player={player}
                allowsFullscreen
                allowsPictureInPicture

            />
        </View>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 50,
    },
    controlsContainer: {
        padding: 10,
    },
});
