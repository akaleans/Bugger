# Generated by Django 3.2.8 on 2021-11-15 23:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('bugger', '0003_auto_20211112_1047'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ticketattachment',
            name='ticket_name',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='bugger.ticket'),
        ),
        migrations.AlterField(
            model_name='ticketcomment',
            name='ticket_name',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='bugger.ticket'),
        ),
        migrations.AlterField(
            model_name='ticketevent',
            name='ticket_name',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='bugger.ticket'),
        ),
    ]
