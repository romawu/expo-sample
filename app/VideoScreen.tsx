import React from 'react';
import {StyleSheet, View, Button, StyleProp, ViewStyle} from 'react-native';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView, VideoPlayer } from 'expo-video';
import {Asset} from "expo-asset";

interface VideoScreenProps {
    source: string;
    style?: StyleProp<ViewStyle>;
    asset?: Asset;
}

export default function VideoScreen({ source, style, asset }: VideoScreenProps): React.JSX.Element {
    const player: VideoPlayer = useVideoPlayer(source, player => {
        player.loop = false;
        player.play();
    });

    const { isPlaying } = useEvent(player, 'playingChange', {
        isPlaying: player.playing,
    });

    return (
        <VideoView
            style={style}
            player={player}
            nativeControls={true}
            contentFit="cover"
        />
    );
}
