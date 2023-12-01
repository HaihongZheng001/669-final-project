import {StyleSheet, Text, View} from 'react-native';
import { generalStyles } from '../styles/Styles';
import { Ionicons } from '@expo/vector-icons';

export function Header(props) {
    const { title, showBackButton } = props
    
    return (
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                <Ionicons name="chevron-back" style={styles.headerIcon}/>
            </View>
            <View style={styles.headerCenter}>
                <Text style={styles.headerText}>
                    {title}
                </Text>
            </View>
            <View style={styles.headerRight}/>
        </View>
    )
}

const styles = StyleSheet.create({
    ...generalStyles
})