package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

func main() {
	thingspeakAPIURL := "https://api.thingspeak.com/channels/2479319/feeds.json?results=2"
	response, err := http.Get(thingspeakAPIURL)
	if err != nil {
		fmt.Println("Error fetching Thingspeak API:", err)
		return
	}
	defer response.Body.Close()

	responseBody, err := ioutil.ReadAll(response.Body)
	fmt.Println(ioutil.ReadAll(response.Body))
	if err != nil {
		fmt.Println("Error reading Thingspeak API response:", err)
		return
	}

	data := map[string]interface{}{
		"subject":     "Test Subject",
		"content":     string(responseBody), // Use Thingspeak API response as email content
		"recipients":  []string{"shashank.suggala2021@vitstudent.ac.in"},
		"attachments": []Attachment{{Filename: "image_1.png", Content: "base64-encoded-content-of-image"}},
	}

	jsonData, err := json.Marshal(data)
	if err != nil {
		fmt.Println("Error encoding JSON:", err)
		return
	}

	resp, err := http.Post("http://localhost:4000/sendEmails", "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		fmt.Println("Error sending request:", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		fmt.Println("Error:", resp.Status)
		return
	}

	fmt.Println("Emails sent successfully")
}

type Attachment struct {
	Filename string `json:"filename"`
	Content  string `json:"content"`
}
