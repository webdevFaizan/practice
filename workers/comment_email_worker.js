const queue = require('../config/kue');

const commentsMailer = require('../mailers/comments_mailer');


//This queue.process function will tell us that the emailing will be sent to a queue, so that the queue. In fact, the queue is a worker and that worker is having a process function. And when ever a new task is added inside the queue, we need to run it inside this process function.
queue.process('emails', function(job, done){            //Here 'emails' is the name of the queue. And the function will consist of two arguments, one is job, job is what this function needs to do. And this queue.process has two things to be done, one it tells that the function inside this commentsMailer.newComment() needs to run. And the job consists of data, which in this case would be the comment data that is being send when the user comments.
    console.log('emails worker is processing a job', job.data);
    commentsMailer.newComment(job.data);        //job.data is exactly equal to the comment object, and we would extract the useful stuff from this method to save it in the database.
    done();
})
