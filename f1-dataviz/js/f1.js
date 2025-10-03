var $ = jQuery.noConflict();

$(document).ready(function(e) {
    SiteManager.init();
});

var SiteManager = {

    myLapData:null,

    init: function() {
        $.getJSON('data/f1-lap-data.json', this.onDataLoaded.bind(this));
    },

    onDataLoaded: function(data) {
        this.myLapData = data;
        //

        const canvas = document.getElementById('circleCanvas');
        const ctx = canvas.getContext('2d');

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 480;


        // Draw outer circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw lines based on data
        const numberOfPoints = this.myLapData.Speed.length;
        let highestSpeed = 0;
        for (let i = 0; i < numberOfPoints; i++) {
            if(this.myLapData.Speed[i] > highestSpeed) {
                highestSpeed = this.myLapData.Speed[i];
            }
        }
        for (let i = 0; i < numberOfPoints; i++) {
            const angle = (i / numberOfPoints) * Math.PI * 2; // angle in radians
            const dataLength = (this.myLapData.Speed[i] / highestSpeed) * radius; // length towards center

            // Starting point on the circumference
            const startX = centerX + Math.cos(angle) * radius;
            const startY = centerY + Math.sin(angle) * radius;

            // Ending point (toward center)
            const endX = centerX + Math.cos(angle) * (radius - dataLength);
            const endY = centerY + Math.sin(angle) * (radius - dataLength);

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = this.valueToColor((this.myLapData.Speed[i] / highestSpeed));
            ctx.lineWidth = 6;
            ctx.stroke();
        }



        var lapTime = data.Time[data.Time.length-1];
        console.log(lapTime);
    },

    valueToColor: function(value){
        // Clamp between 0 and 1
        value = Math.max(0, Math.min(1, value));

        // Green = (0, 255, 0), Red = (255, 0, 0)
        const r = Math.floor(255 * value);       // goes from 0 → 255
        const g = Math.floor(255 * (1 - value)); // goes from 255 → 0
        const b = 0;

        return `rgb(${r},${g},${b})`;
    }
};