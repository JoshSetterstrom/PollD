const {MessageAttachment} = require('discord.js');
const Canvas = require('canvas');
const splitCanvasString = require('../utils/splitCanvasString');
const axios = require('axios');
const resizeImage = require('../utils/resizeImage');

module.exports = class PollCanvas{
    constructor(poll) {
        this.poll = poll;
        this.votes = poll.votes;
        this.title = poll.title;
        this.options = poll.options;
        this.id = poll.id;
        this.date = poll.createdAt;
        this.imgurl = poll.image;
    }

    /** Retrieves and converts img url to jpg or png */
    async getImage() {
        try {
            const res = await axios.get(this.imgurl, {responseType: 'arraybuffer'});
            const buffer = Buffer.from(res.data, 'utf-8');
            const image = await Canvas.loadImage(buffer);
            let dimensions = resizeImage(image);
    
            return {
                image: image,
                width: dimensions.width,
                height: dimensions.height
            };
        } catch {
            return false;
        };
    };

    renderPoll() {
        this.getCanvasHeight({title:true, options:true, footer:true});
        this.setCanvas();
        this.setTitle();
        this.setOptions();
        this.setFooter();
        return new MessageAttachment(this.canvas.toBuffer(), 'profile-image.png');
    };

    async renderPollWithImage() {
        this.image = await this.getImage();
        if (!this.image) return false;
        this.getCanvasHeight({title:true, options:true, footer:true});
        this.setCanvas();
        this.setTitle();
        this.setImage();
        this.setOptions();
        this.setFooter();
        return new MessageAttachment(this.canvas.toBuffer(), 'profile-image.png');
    }

    renderPollClosed() {
        this.getCanvasHeight({closed:true, title:true, options:true, footer:true});
        this.setCanvas();
        this.setClosed();
        this.setTitle();
        this.setOptions();
        this.setFooter();
        return new MessageAttachment(this.canvas.toBuffer(), 'profile-image.png');
    }

    async renderPollClosedWithImage() {
        this.image = await this.getImage();
        this.getCanvasHeight({closed: true, title:true, options:true, footer:true, image:true});
        this.setCanvas();
        this.setClosed();
        this.setTitle();
        this.setImage();
        this.setOptions();
        this.setFooter();
        return new MessageAttachment(this.canvas.toBuffer(), 'profile-image.png');
    }

    async renderPollCanvas() {
        if (this.poll.status === "closed") {
            return this.poll.image ? this.renderPollClosedWithImage() : this.renderPollClosed();
        } else {
            return this.poll.image ? this.renderPollWithImage() : this.renderPoll();
        };
    };

    /** Calculates all height values to get max height of rendered Canvas */
    getCanvasHeight({closed=false, title=false, options=false, footer=false, image=true}={}) {
        let canvas  = Canvas.createCanvas(1000, 1000);
        let ctx     = canvas.getContext('2d');
        this.closed = !closed ? 0 : 70;
        ctx.font    = '30px serif';

        try   {this.urlimage = this.image.height + 30}
        catch {this.urlimage = 0};
    
        this.titleHeight   = splitCanvasString(ctx, this.title).filter(Boolean).length*40 + 60;
        this.optionsHeight = 100*this.options.length;
        this.footerHeight  = 100;
        this.canvasHeight  = (this.closed)
                           + (!title ? 0 : this.titleHeight)
                           + (this.urlimage)
                           + (!options ? 0 : this.optionsHeight)
                           + (!footer ? 0 : this.footerHeight);
    };

    setCanvas() {
        this.canvas        = Canvas.createCanvas(1000, this.canvasHeight);
        this.ctx           = this.canvas.getContext('2d');
        this.ctx.fillStyle = "white";

        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    };

    setClosed() {
        this.ctx.fillStyle = "black";
        this.ctx.font      = '40px serif';
        let stringWidth    = this.ctx.measureText("Poll Closed").width;

        this.ctx.fillText("Poll Closed", (this.canvas.width/2) - (stringWidth / 2), 60);
    }

    setTitle() {
        this.ctx.fillStyle = "black";
        this.ctx.font      = '30px serif';
        let textwidth      = this.ctx.measureText(this.title).width;

        /** If title is longer than 800px splitCanvasString converts to multiple lines */
        if (textwidth > 800) {
            let stringArray = splitCanvasString(this.ctx, this.title);

            stringArray.forEach((string, i) => {
                if (string === '') return;

                let stringWidth = this.ctx.measureText(string).width;

                this.ctx.fillText(
                    string, (this.canvas.width/2) - (stringWidth / 2), 60 + this.closed + (i*40));
            })
        } else {
            this.ctx.fillText(
                this.title, (this.canvas.width/2) - (textwidth / 2), 60 + this.closed);
        }

        this.ctx.lineWidth   = 1;
        this.ctx.strokeStyle = "black";

        this.ctx.beginPath();
        this.ctx.moveTo(75, this.titleHeight + this.closed + this.urlimage);
        this.ctx.lineTo(925, this.titleHeight + this.closed + this.urlimage);
        this.ctx.stroke();
    }

    setImage() {        
        let center = (this.canvas.width - this.image.width) / 2;

        this.ctx.drawImage(
            this.image.image, 
            center, 
            this.closed + this.titleHeight, 
            this.image.width, 
            this.image.height);
    };

    setOptions() {
        this.options.forEach((option, i) => {
            let voteTextHeight   = 60 + (this.titleHeight + i*100) + this.closed + this.urlimage;
            let voteBarHeight    = 85 + (this.titleHeight + i*100) + this.closed + this.urlimage;
            let plural           = option.votes === 1 ? "" : "s";

            let voteBarFillWidth = Object.is(this.votes/option.votes, NaN)
                                 ? 85
                                 : (830 * option.votes/this.votes) + 85;

            let percentage       = Object.is(this.votes/option.votes, NaN) || option.votes === 0
                                 ? "0"
                                 : Math.round((option.votes/this.votes)*100);

            let currentVote      = `${option.votes} Vote${plural} | ${percentage}%`;

            let currentVoteX     = i === 0
                                 ? 1000 - this.ctx.measureText(currentVote).width - 47
                                 : 1000 - this.ctx.measureText(currentVote).width - 75;
    
            //option title
            this.ctx.fillStyle   = "black";
            this.ctx.font        = '26px serif';

            this.ctx.fillText(option.value, 73, voteTextHeight);
    
            //option count
            this.ctx.fillStyle   = "black";
            this.ctx.font        = '26px serif';

            this.ctx.fillText(`${option.votes} Vote${plural} | ${percentage}%`,
                              currentVoteX, 
                              voteTextHeight);
    
            //option bar empty
            this.ctx.lineWidth   = 25;
            this.ctx.lineCap     = 'round';
            this.ctx.strokeStyle = "#D3D3D3";

            this.ctx.beginPath();
            this.ctx.moveTo(85, voteBarHeight);
            this.ctx.lineTo(915, voteBarHeight);
            this.ctx.stroke();
    
            //option bar fill
            this.ctx.lineWidth   = 25;
            this.ctx.lineCap     = 'round';
            this.ctx.strokeStyle = "#5865F2";

            this.ctx.beginPath();
            this.ctx.moveTo(85, voteBarHeight);
            this.ctx.lineTo(voteBarFillWidth, voteBarHeight);
            this.ctx.stroke();
        })
    }

    setFooter() {
        let date                 = `Created: ${this.date}`;
        let footerDateWidth      = 1000 - this.ctx.measureText(date).width + 28;
        this.footerHeight        = this.titleHeight + this.optionsHeight + 35;
        this.footerContentHeight = this.footerHeight + 40;
        this.ctx.lineWidth       = 1;
        this.ctx.strokeStyle     = "black";

        //separator
        this.ctx.beginPath();
        this.ctx.moveTo(75, this.footerHeight + this.closed + this.urlimage);
        this.ctx.lineTo(925, this.footerHeight + this.closed + this.urlimage);
        this.ctx.stroke();

        //footer content
        this.ctx.fillStyle       = "#5a706e";
        this.ctx.font            = '20px serif';

        this.ctx.fillText(
            `PollID: ${this.id}`, 75, this.footerContentHeight + this.closed + this.urlimage);
        this.ctx.fillText(
            date, footerDateWidth, this.footerContentHeight + this.closed + this.urlimage);
    };
};