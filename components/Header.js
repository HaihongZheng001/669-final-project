import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { generalStyles } from '../styles/Styles';
import { Ionicons } from '@expo/vector-icons';

export function Header(props) {
    const { title, showBackButton, navigation, route } = props
    
    return (
        <View style={styles.header}>
            <View style={styles.headerLeft}>
            {showBackButton ? 
                <TouchableOpacity style={styles.topLeftOpacityContainer} onPress={() => {
                    if(navigation) {
                        navigation.goBack();
                    }
                }}>
                    <Ionicons name="chevron-back" style={styles.headerIcon}/>
                </TouchableOpacity>
                :null
            }
            
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