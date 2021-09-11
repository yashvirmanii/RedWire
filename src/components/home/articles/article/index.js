import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Image } from 'react-native-elements'
import ContentShow from '../../../../utils/contentShow';
import { useRoute } from '@react-navigation/native';


const ArticleScreen = () => {
    const {params} = useRoute();
    return(
        <ScrollView>
            <View>
                <Image 
                    source={{uri:params.postData.image}}
                    style={{width:'100%', height:200}}
                    PlaceholderContent={<ActivityIndicator/>}
                />     
                <ContentShow params={params}/>           
            </View>
        </ScrollView>
    )
}

export default ArticleScreen;